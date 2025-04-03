import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Device } from '../../types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ProcessType, ProcessTypeLabels, WS_BASE_URL } from '../../constants';
import { getErrorMessage } from '../../utils/streamingErrors';

const FileStreamer: React.FC<{ device?: Device }> = ({ device }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(true);
  const [isStopButtonDisabled, setIsStopButtonDisabled] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [processType, setProcessType] = useState<ProcessType>(ProcessType.FOG);

  const MAX_RECONNECTION_ATTEMPTS = 5;
  const RECONNECTION_DELAY = 2000;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Clear existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      // Create object URL for video preview
      const videoURL = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoURL;
        // Add loadedmetadata event listener
        videoRef.current.onloadedmetadata = () => {
          setIsStartButtonDisabled(false);
        };
      }
    }
  };

  const createStreamFromVideo = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas reference not found');
      return null;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }

    console.log('🎨 Setting up canvas stream...');
    
    // Set canvas size to match video dimensions with proper quality
    const targetWidth = 1280; // HD width
    const targetHeight = 720; // HD height
    
    // Calculate aspect ratio
    const aspectRatio = video.videoWidth / video.videoHeight;
    
    // Set dimensions maintaining aspect ratio
    if (aspectRatio > targetWidth / targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetWidth / aspectRatio;
    } else {
      canvas.height = targetHeight;
      canvas.width = targetHeight * aspectRatio;
    }
    
    console.log(`📐 Canvas size set to ${canvas.width}x${canvas.height}`);

    // Configure canvas for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Create a stream from the canvas with higher framerate
    const canvasStream = canvas.captureStream(30); // 30 FPS
    console.log('🎬 Canvas stream created at 30 FPS');

    // Start the drawing loop with timing control
    let lastDrawTime = 0;
    const frameInterval = 1000 / 30; // 30 FPS in ms

    const drawVideo = (timestamp: number) => {
      if (video.paused || video.ended) return;

      // Control frame rate
      if (timestamp - lastDrawTime >= frameInterval) {
        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw video frame with proper scaling
        ctx.drawImage(
          video,
          0, 0, video.videoWidth, video.videoHeight,  // Source dimensions
          0, 0, canvas.width, canvas.height           // Destination dimensions
        );
        
        lastDrawTime = timestamp;
      }
      
      requestAnimationFrame(drawVideo);
    };

    // Setup video looping with proper timing
    const setupVideoLoop = () => {
      console.log('🔄 Video ended, restarting playback...');
      video.currentTime = 0;
      video.play().then(() => {
        console.log('▶️ Video restarted successfully');
      }).catch(err => {
        console.error('❌ Error restarting video:', err);
      });
    };

    // Remove any existing ended event listener
    video.removeEventListener('ended', setupVideoLoop);
    // Add the ended event listener
    video.addEventListener('ended', setupVideoLoop);

    // Configure video playback
    video.playbackRate = 1.0; // Ensure normal playback speed
    
    // Ensure video starts playing with proper initialization
    video.play().then(() => {
      console.log('▶️ Video started successfully');
      requestAnimationFrame(drawVideo);
      console.log('🎨 Drawing loop started');
    }).catch(err => {
      console.error('❌ Error playing video:', err);
    });

    return canvasStream;
  }, []);

  const connectWebSocket = useCallback(() => {
    if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
      setIsStartButtonDisabled(false);
      return null;
    }

    if (!device?.streamKey) {
      console.log("Device or device stream key not found");
      return null;
    }

    const videoStream = stream;
    if (!videoStream) {
      console.error('No media stream available');
      return null;
    }

    const wsConnection = new WebSocket(
      `${WS_BASE_URL}?streamKey=${device.streamKey}&process=${processType.toLowerCase()}`
    );

    wsConnection.onopen = () => {
      console.log('✅ WebSocket connection established');
      setConnectionAttempts(0);
      setIsStopButtonDisabled(false);

      try {
        const newMediaRecorder = new MediaRecorder(videoStream, {
          mimeType: 'video/webm; codecs=vp8',
          videoBitsPerSecond: 2500000 // 2.5 Mbps for better quality
        });

        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && wsConnection.readyState === WebSocket.OPEN) {
            console.log(`📡 Sending video chunk: ${event.data.size} bytes`);
            wsConnection.send(event.data);
          }
        };

        newMediaRecorder.onerror = (event) => {
          console.error("❌ MediaRecorder error:", event.error);
        };

        // Start recording with smaller timeslices for smoother streaming
        newMediaRecorder.start(50); // Reduced from 100ms to 50ms
        console.log('🎥 MediaRecorder started with enhanced settings');
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
      
      // Show error to user
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
  }, [connectionAttempts, device, processType, stream]);

  const handleStartStreaming = useCallback(() => {
    try {
      // Ensure any existing stream is cleaned up
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = createStreamFromVideo();
      if (newStream) {
        setStream(newStream);
        console.log('✅ Stream created successfully');
      } else {
        throw new Error('Failed to create stream');
      }
    } catch (err) {
      console.error('Error starting stream:', err);
      alert('Failed to start streaming. Please try again.');
      setIsStartButtonDisabled(false);
    }
  }, [createStreamFromVideo, stream]);

  useEffect(() => {
    if (stream) {
      const wsConnection = connectWebSocket();
      if (wsConnection) {
        setSocket(wsConnection);
      }
    }
  }, [stream, connectWebSocket]);

  const handleStopStreaming = useCallback(() => {
    if (isStopButtonDisabled) return;

    console.log("🛑 Stopping streaming...");

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
        setStream(null);
      }

      if (videoRef.current) {
        videoRef.current.pause();
      }

      setMediaRecorder(null);
      setSocket(null);
      setIsStartButtonDisabled(false);
      setIsStopButtonDisabled(true);
    } catch (error) {
      console.error('Error during cleanup:', error);
      setIsStartButtonDisabled(false);
      setIsStopButtonDisabled(true);
    }
  }, [mediaRecorder, socket, stream, isStopButtonDisabled]);

  useEffect(() => {
    return () => {
      handleStopStreaming();
    };
  }, [handleStopStreaming]);

  return (
    <div className="container p-4 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">File Video Streaming to RTMP</h1>
      <p className="mb-4 text-gray-700">
        Select a video file to stream it to the RTMP server via WebSocket.
        The video will loop continuously until streaming is stopped.
      </p>

      <div className="mb-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="mb-4"
        />
      </div>

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
          className="w-full h-full object-contain"
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default FileStreamer; 