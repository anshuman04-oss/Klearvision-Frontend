import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Device } from '../../types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ProcessType, ProcessTypeLabels, WS_BASE_URL } from '../../constants';

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
      
      // Create object URL for video preview
      const videoURL = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoURL;
      }
      setIsStartButtonDisabled(false);
    }
  };

  const createStreamFromVideo = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Create a stream from the canvas
    const canvasStream = canvas.captureStream(30); // 30 FPS

    // Start the drawing loop
    const drawVideo = () => {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawVideo);
    };

    video.play();
    drawVideo();

    // Loop the video
    video.onended = () => {
      video.currentTime = 0;
      video.play();
    };

    return canvasStream;
  }, []);

  const connectWebSocket = useCallback(() => {
    if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
      setIsStartButtonDisabled(false);
      return null;
    }

    if (!device?.streamKey) {
      console.error("Device or device stream key not found");
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
          mimeType: 'video/webm; codecs=vp8'
        });

        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && wsConnection.readyState === WebSocket.OPEN) {
            wsConnection.send(event.data);
          }
        };

        newMediaRecorder.start(100);
        setMediaRecorder(newMediaRecorder);
        setIsStartButtonDisabled(true);
      } catch (err) {
        console.error('Failed to create MediaRecorder:', err);
        wsConnection.close();
      }
    };

    wsConnection.onclose = (event) => {
      console.warn(`WebSocket closed. Code: ${event.code}`);
      setIsStopButtonDisabled(true);
      
      if (!event.wasClean && connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
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
    };

    return wsConnection;
  }, [connectionAttempts, device, processType, stream]);

  const handleStartStreaming = useCallback(() => {
    const newStream = createStreamFromVideo();
    if (newStream) {
      setStream(newStream);
    }
  }, [createStreamFromVideo]);

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

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.pause();
    }

    setMediaRecorder(null);
    setSocket(null);
    setIsStartButtonDisabled(false);
    setIsStopButtonDisabled(true);
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