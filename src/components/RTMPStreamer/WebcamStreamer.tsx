import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Device } from '../../types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ProcessType, ProcessTypeLabels, WS_BASE_URL } from '../../constants';
import { getErrorMessage } from '../../utils/streamingErrors';

const WebcamStreamer: React.FC<{ device?: Device }> = ({ device }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false);
  const [isStopButtonDisabled, setIsStopButtonDisabled] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const MAX_RECONNECTION_ATTEMPTS = 5;
  const RECONNECTION_DELAY = 2000; // 2 seconds
  const [processType, setProcessType] = useState<ProcessType>(ProcessType.FOG);

  const connectWebSocket = useCallback(() => {
    if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
      setIsStartButtonDisabled(false);
      return null;
    }

    if(!device || !device.streamKey) {
        console.log("Device or device stream key not found");
      return null;
    }
    
    const videoStream = videoRef.current?.srcObject as MediaStream;
    
    // First, verify that we have a valid stream
    if (!videoStream) {
      console.error('No media stream available');
      return null;
    }
    
    const wsConnection = new WebSocket(`${WS_BASE_URL}?streamKey=${device.streamKey}&process=${processType.toLowerCase()}`);
    
    wsConnection.onopen = () => {
      console.log('✅ WebSocket connection established');
      setConnectionAttempts(0);
      setIsStopButtonDisabled(false);

      try {
        const newMediaRecorder = new MediaRecorder(videoStream, { 
          mimeType: 'video/webm; codecs=vp8' 
        });

        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && wsConnection.readyState === WebSocket.OPEN) {
            console.log(`📡 Sending video chunk: ${event.data.size} bytes`);
            wsConnection.send(event.data);
          }
        };

        newMediaRecorder.onerror = (event) => {
          console.error("❌ MediaRecorder error:", event);
        };

        // Start recording, sending data every 100ms
        newMediaRecorder.start(100);
        console.log('🎥 MediaRecorder started.');
        setMediaRecorder(newMediaRecorder);
        setIsStartButtonDisabled(true);
      } catch (err) {
        console.error('Failed to create MediaRecorder:', err);
        wsConnection.close();
      }
    };

    wsConnection.onclose = (event) => {
      const errorMessage = getErrorMessage(event.code, event.reason);
      console.error(`WebSocket closed: ${errorMessage}`);
      
      // Show error to user (you might want to use a toast or alert system)
      if (event.code >= 4000) {
        // This is a custom error from our server
        alert(errorMessage);
        setIsStartButtonDisabled(false);
        setIsStopButtonDisabled(true);
        return;
      }
      
      // Handle normal disconnects and reconnection
      if (!event.wasClean && connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
        console.log(`Attempting to reconnect (${connectionAttempts + 1}/${MAX_RECONNECTION_ATTEMPTS})`);
        setTimeout(() => {
          setConnectionAttempts(prev => prev + 1);
          connectWebSocket();
        }, RECONNECTION_DELAY);
      } else {
        setIsStartButtonDisabled(false);
      }
    };

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Log additional connection details for debugging
      console.log('WebSocket State:', {
        readyState: wsConnection.readyState,
        bufferedAmount: wsConnection.bufferedAmount,
        url: wsConnection.url
      });
    };

    return wsConnection;
  }, [connectionAttempts, device]);

  const handleStartStreaming = useCallback(async () => {
    try {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }

      // Ensure no existing stream is active
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Request access to camera (video only)
      console.log("Requesting camera access...");
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { min: 15, ideal: 30, max: 60 }
        },
        audio: false
      });
      
      console.log("✅ Camera access granted.");
      
      // Set video source first
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      // Set stream in state and connect WebSocket after state is updated
      setStream(newStream);
      const wsConnection = connectWebSocket();
      if (wsConnection) {
        setSocket(wsConnection);
      }

    } catch (err : any) {
      console.error(`❌ Error accessing media devices: ${err.name} - ${err.message}`);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          alert('Permissions have not been granted to use your camera. Please check your settings.');
        } else if (err.name === 'NotFoundError') {
          alert('No camera found. Please connect a camera.');
        } else if (err.name === 'NotReadableError') {
          alert('Camera is already in use by another application.');
        } else if (err.name === 'OverconstrainedError') {
          alert('The specified constraints cannot be met by your device.');
        } else {
          alert(`Error accessing media devices: ${err.message}`);
        }
      }
    }
  }, [stream, connectWebSocket]);

  const handleStopStreaming = useCallback(() => {
    // Add a guard to prevent multiple stops
    if (isStopButtonDisabled) {
      return;
    }

    console.log("🛑 Stopping streaming...");

    // Immediately disable both buttons during cleanup
    setIsStartButtonDisabled(true);
    setIsStopButtonDisabled(true);

    try {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('⏹️ MediaRecorder stopped.');
      }

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log('🔌 WebSocket closed.');
      }

      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.kind} stopped.`);
        });
        console.log("🎥 Camera turned off.");
        setStream(null);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Reset state
      setMediaRecorder(null);
      setSocket(null);
      
      // Re-enable start button after cleanup
      setIsStartButtonDisabled(false);
    } catch (error) {
      console.error('Error during cleanup:', error);
      // Ensure buttons are in correct state even if there's an error
      setIsStartButtonDisabled(false);
      setIsStopButtonDisabled(true);
    }
  }, [mediaRecorder, socket, stream, isStopButtonDisabled]);

  // Modify the cleanup effect to use a flag to prevent multiple cleanups
  useEffect(() => {
    let mounted = true;

    return () => {
      if (mounted) {
        mounted = false;
        handleStopStreaming();
      }
    };
  }, [handleStopStreaming]);

  return (
    <div className="container p-4 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Webcam Video Streaming to RTMP (through Node)</h1>
      <p className="mb-4 text-gray-700">
        This page captures your webcam video (without audio) and sends it to a Node.js server via WebSocket.
        The server then pipes it to FFmpeg and publishes it over RTMP.
        Click <strong>Start Streaming</strong> to begin, and <strong>Stop Streaming</strong> when finished.
      </p>

      <div className="mb-4">
        <FormControl fullWidth size="small">
          <InputLabel id="process-type-label">Process Type</InputLabel>
          <Select
            labelId="process-type-label"
            id="process-type"
            value={processType}
            label="Process Type"
            onChange={(e) => setProcessType(e.target.value as ProcessType)}
          >
            {Object.values(ProcessType).map((type) => (
              <MenuItem key={type} value={type}>
                {ProcessTypeLabels[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleStartStreaming}
          disabled={isStartButtonDisabled}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${isStartButtonDisabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            }`}
        >
          Start Streaming
        </button>
        <button
          onClick={handleStopStreaming}
          disabled={isStopButtonDisabled}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${isStopButtonDisabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            }`}
        >
          Stop Streaming
        </button>
      </div>

      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default WebcamStreamer; 