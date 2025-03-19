import React, { useEffect, useState, useCallback, useRef } from 'react';
import DropdownSide from '../DropdownSide';
import { red } from '@mui/material/colors';

const WebcamStreamer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false);
  const [isStopButtonDisabled, setIsStopButtonDisabled] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const MAX_RECONNECTION_ATTEMPTS = 5;
  const RECONNECTION_DELAY = 2000; // 2 seconds

  const connectWebSocket = useCallback(() => {
    if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
      setIsStartButtonDisabled(false);
      return null;
    }
    
    const videoStream = videoRef.current?.srcObject as MediaStream;
    
    // First, verify that we have a valid stream
    if (!videoStream) {
      console.error('No media stream available');
      return null;
    }
    
    const wsConnection = new WebSocket('wss://serverklearvision.work.gd/');
    
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
          console.error("❌ MediaRecorder error:", event.error);   
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

    wsConnection.onclose = (closeEvent) => {
    //   const tempEvent = closeEvent;
      const closeReason = `Code: ${closeEvent.code}, Reason: ${closeEvent.reason || 'No reason provided'}`;
      console.warn(`⚠️ WebSocket connection closed. ${closeReason}`);
      setIsStopButtonDisabled(true);
      
      if (!closeEvent.wasClean && connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
        const nextAttempt = connectionAttempts + 1;
        
        setTimeout(() => {
          setConnectionAttempts(nextAttempt);
          connectWebSocket();
        }, RECONNECTION_DELAY);
      } else {
        setIsStartButtonDisabled(false);
      }
    };

    // const wsConnection = new WebSocket('wss://serverklearvision.work.gd/');
    wsConnection.onerror = (err) => {
      const errorDetails = err instanceof ErrorEvent ? err.message : 'Unknown error';
      console.error('❌ WebSocket error:', errorDetails);
      
      // Log additional connection details for debugging
      console.log('WebSocket State:', {
        readyState: wsConnection.readyState,
        bufferedAmount: wsConnection.bufferedAmount,
        url: wsConnection.url,
        protocol: wsConnection.protocol || 'none'
      });
    };

    return wsConnection;
  }, [connectionAttempts]);

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

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`❌ Error accessing media devices: ${err.name} - ${err.message}`);
      } else {
        console.error('❌ Error accessing media devices:', err);
      }
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

  // function setFilter(value: string): void {
  //   throw new Error('Function not implemented.');
  // }

  return (
    // <div className="container p-4 mx-auto max-w-4xl">
    //   <h1 className="text-2xl font-bold mb-4">Webcam Video Streaming to RTMP (through Node)</h1>
    //   <p className="mb-4 text-gray-700">
    //     This page captures your webcam video (without audio) and sends it to a Node.js server via WebSocket.
    //     The server then pipes it to FFmpeg and publishes it over RTMP.
    //     Click <strong>Start Streaming</strong> to begin, and <strong>Stop Streaming</strong> when finished.
    //   </p>

    //   <div className="flex gap-4 mb-4">
    //     <button
    //       onClick={handleStartStreaming}
    //       disabled={isStartButtonDisabled}
    //       className={`px-4 py-2 rounded-md text-white font-medium
    //         ${isStartButtonDisabled 
    //           ? 'bg-gray-400 cursor-not-allowed' 
    //           : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
    //         }`}
    //     >
    //       Start Streaming
    //     </button>
    //     <button
    //       onClick={handleStopStreaming}
    //       disabled={isStopButtonDisabled}
    //       className={`px-4 py-2 rounded-md text-white font-medium
    //         ${isStopButtonDisabled 
    //           ? 'bg-gray-400 cursor-not-allowed' 
    //           : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
    //         }`}
    //     >
    //       Stop Streaming
    //     </button>
    //   </div>

    //   <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
    //     <video
    //       ref={videoRef}
    //       autoPlay
    //       playsInline
    //       muted
    //       className="w-full h-full object-contain"
    //     />
    //   </div>
    // </div>

    // <div
    //   className="hls-player-container"
    //   style={{ textAlign: "center", padding: "20px" }}
    // >
    //   <h1 className="text-gray-50 text-4xl font-bold mt-10">Playing Your Video</h1>

    //   <div
    //     className="video-container"
    //     style={{
    //       display: "flex",
    //       justifyContent: "center",
    //       marginTop: "30px",
    //       maxWidth: "1000px",
    //       position: "relative",
    //     }}
    //   >
    //     {/* {isPlaying && <h2>Stream is now playing:</h2>} */}
    //     {/* {device && device.playBackUrl && device.playBackToken && ( */}
    //       <video
    //         ref={videoRef}
    //         controls
    //         style={{
    //           width: "50%",
    //           height: "auto",
    //           borderRadius: "8px",
    //           border: "1px solid white",
    //           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //         }}
    //       />
    //      {/* )} */}
    //   </div>

    //   <DropdownSide
    //     sideElements={["Fog", "Rain"]}
    //     // onChange={(e) => setFilter(e.target.value)}
    //   />

    //   <button
    //     style={{
    //       padding: "5px 10px",
    //       backgroundColor: "#4CAF50",
    //       color: "white",
    //       border: "2px solid #4CAF50",
    //       borderRadius: "4px",
    //       cursor: "pointer",
    //       marginTop: "10px",
    //       fontWeight: "bold",
    //       marginRight: "2px",
    //       marginLeft: "4px"
    //     }}
    //     onClick={handleStartStreaming}
    //     disabled={isStartButtonDisabled}
    //     className={`${isStartButtonDisabled 
    //                 ? 'bg-gray-400 cursor-not-allowed' 
    //                 : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
    //               }`}
    //   >
    //     Start Streaming
    //   </button>

    //   <button
    //     style={{
    //       padding: "5px 10px",
    //       backgroundColor: "red",
    //       color: "white",
    //       border: "2px solid red",
    //       borderRadius: "4px",
    //       cursor: "pointer",
    //       marginTop: "10px",
    //       fontWeight: "bold",
    //       marginRight: "2px",
    //       marginLeft: "2px"
    //     }}
    //     onClick={handleStopStreaming}
    //     className={`${isStopButtonDisabled 
    //                 ? 'bg-gray-400 cursor-not-allowed' 
    //                 : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
    //               }`}
    //   >
    //     Stop Streaming
    //   </button>

    //   {/* {filter === "Fog" && <FogFilter />}
    //   {filter === "Rain" && <RainFilter />} */}
    //   {/* <CommonFilters /> */}
    // </div>

    <div
  className="hls-player-container flex flex-col items-center p-6 min-h-screen bg-gray-900"
>
  {/* Title */}
  <h1 className="text-gray-50 text-4xl font-bold mt-10">Playing Your Video</h1>

  {/* Video Container */}
  <div className="flex justify-center w-full mt-8">
    <div
      className="relative flex justify-center w-full max-w-3xl border border-white rounded-lg shadow-lg overflow-hidden"
    >
      <video
        ref={videoRef}
        controls
        className="w-full h-auto rounded-lg"
      />
    </div>
  </div>

  {/* Dropdown and Buttons Container */}
  <div className="flex flex-col sm:flex-row items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
    <DropdownSide
      sideElements={["Fog", "Rain"]}
      // className="bg-white border border-gray-300 rounded px-4 py-2"
    />

    <button
      onClick={handleStartStreaming}
      disabled={isStartButtonDisabled}
      className={`px-6 py-2 font-bold text-white border rounded ${
        isStartButtonDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700 active:bg-green-800 border-green-600"
      }`}
    >
      Start Streaming
    </button>

    <button
      onClick={handleStopStreaming}
      className={`px-6 py-2 font-bold text-white border rounded ${
        isStopButtonDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 active:bg-red-800 border-red-600"
      }`}
    >
      Stop Streaming
    </button>
  </div>
</div>

  );
};

export default WebcamStreamer; 

































// import { useEffect, useState } from 'react';
// import './App.css'


// function App() {

//       const [stream, setStream] = useState<MediaStream | null>(null);
//       const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//       const [startAble, setStartAble] = useState<boolean>(true);
//       const [stopAble, setStopAble] = useState<boolean>(false);
//       const [socket, setSocket] = useState<WebSocket>() 

//       // Using the below function, we can capture the user media as soon as the window loads.

//       // For camera and mic permission
//       useEffect(() => {
//         const getMediaStream = async () => {
//             try {
//                 const constraints = {
//                     video: {
//                       width: { ideal: 1280 },
//                       height: { ideal: 720 },
//                       frameRate: { ideal: 30 }
//                     },
//                     audio: true
//                 };
//                 console.log("Requesting camera and microphone access...");
//                 const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//                 console.log(newStream.getVideoTracks()[0].readyState);
//                 if(newStream.getVideoTracks()[0].readyState === 'live') {
//                     setStream((prevStream) => {
//                         prevStream?.getTracks().forEach(track => track.stop());
//                         return newStream;
//                     })
//                 }
//                 setStream(newStream); // Store the stream in state
//                 // Request access to camera and microphone
//                 console.log("✅ Camera & microphone access granted.");
//                 console.log(stream);
//             } catch (error) {
//                 console.error("Error capturing the stream: ", error);
//                 setStream(null);
//             }
//         };

//         getMediaStream();

//         return () => {
//             // Cleanup: Stop the tracks when component unmounts
//             stream?.getTracks().forEach(track => track.stop());
//         };
//     }, []);

//     useEffect(() => {
//         const getMediaStream = async () => {
//         if (stream && stream.getVideoTracks()[0].readyState === "live") {
//             try {
//                 // console.log("🔄 Stream is live and updated.");
//                 const constraints = {
//                     video: {
//                       width: { ideal: 1280 },
//                       height: { ideal: 720 },
//                       frameRate: { ideal: 30 }
//                     },
//                     audio: true
//                 };
//                 // console.log("Requesting camera and microphone access...");
//                 const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//                 // console.log(newStream.getVideoTracks()[0].readyState);
//                 if(newStream.getVideoTracks()[0].readyState === 'live') {
//                     setStream((prevStream) => {
//                         prevStream?.getTracks().forEach(track => track.stop());
//                         return newStream;
//                     })
//                 }
//                 // setStream(newStream); // Store the stream in state
//                 // Request access to camera and microphone
//                 // console.log("✅ Camera & microphone access granted.");
//                 // console.log(stream);
//             } catch (error) {
//                 console.error("Error capturing the stream: ", error);
//                 setStream(null);
//             }
//         }
//         }
//         getMediaStream();

//         return () => {
//             // Cleanup: Stop the tracks when component unmounts
//             stream?.getTracks().forEach(track => track.stop());
//         };

//     }, [stream])

//     useEffect(() => {
//         if (!stream) return;

//         const tempMedia = new MediaRecorder(stream, { 
//             mimeType: 'video/webm; codecs=vp8',
//             audioBitsPerSecond: 128000,
//             videoBitsPerSecond: 2500000,
//         });

//         setMediaRecorder(tempMedia);

//         if (mediaRecorder !== null) {
//             mediaRecorder.ondataavailable = (event) => {
//               //   if (event.data.size > 0 && socket && socket.readyState === WebSocket.OPEN) {
//                 console.log(event.data);
//                 console.log(stream);
//                 console.log("Binary data available", event.data);
//                   //   socket.send(event.data);  // Node server will capture this and stream to rtmp server using ffmpeg
//                   //   }
//             };

//             mediaRecorder.onerror = (event) => {
//                 console.error("❌ MediaRecorder error:", event.error);
//                 alert("MediaRecorder error: " + event.error.message);
//             };
//         }

//         return () => {
//             mediaRecorder?.stop();
//         }
//     }, [mediaRecorder])
  
//         const handleStartStream = () => {
//             try {
//                 // Check if the browser supports getUserMedia
//                 if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//                     alert('getUserMedia is not supported in your browser.');
//                     return;
//                 }
    
//                 // Ensure no existing stream is active
//                 // if (stream) {
//                 //     stream.getTracks().forEach(track => track.stop());
//                 // }
                        
//                     if (mediaRecorder) {
//                         mediaRecorder.start(100);
//                         console.log('🎥 MediaRecorder started.');
//                     } else {
//                         console.error('❌ MediaRecorder is null.');
//                     }          
//                 // Start recording, sending data every 100ms
//                 // setStartAble(!startAble); // Later the startBtn to be disabled if able is false.
//                 // }
//             } catch (err: unknown) {
//                 if (err instanceof Error) {
//                     console.error(`❌ Error accessing media devices: ${err.name} - ${err.message}`);
//                 } else {
//                     console.error(`❌ Error accessing media devices: ${err}`);
//                 }
    
//                 if ((err as Error).name === 'NotAllowedError') {
//                     alert('Permissions have not been granted to use your camera and microphone. Please check your settings.');
//                 } else if ((err as Error).name === 'NotFoundError') {
//                     alert('No media devices found. Please connect a camera and/or microphone.');
//                 } else if ((err as Error).name === 'NotReadableError') {
//                     alert('Media device is already in use by another application.');
//                 } else if ((err as Error).name === 'OverconstrainedError') {
//                     alert('The specified constraints cannot be met by your device.');
//                 } else {
//                     alert(`Error accessing media devices: ${(err as Error).message}`);
//                 }
//             }
//         }

//       const handleStopStream = () => {
//         console.log("🛑 Stopping streaming...");

//         if (mediaRecorder && mediaRecorder.state !== 'inactive') {
//             mediaRecorder.stop();
//             console.log('⏹️ MediaRecorder stopped.');
//         }

//         if (socket && socket.readyState === WebSocket.OPEN) {
//             socket.close();
//             console.log('🔌 WebSocket closed.');
//         }

//         if (stream) {
//             stream.getTracks().forEach(track => track.stop());
//             console.log("🎤🎥 Camera & microphone turned off.");
//         }

//         // Remove the video element if it exists
//         // const videoElement = document.querySelector('video');
//         // if (videoElement) {
//         //     videoElement.srcObject = null;
//         //     document.body.removeChild(videoElement);
//         // }

//         setStartAble(true);
//         setStopAble(stopAble);

//     }

//   return (
//     <div className='bg-gray-800 text-gray-50 w-screen h-screen'>
//       <h1>Webcam Streaming to RTMP (through Node)</h1>
//       <p>
//         This page captures your webcam and microphone, sending the video/audio
//         to a Node.js server via WebSocket. The server then pipes it to FFmpeg
//         and publishes it over RTMP. Click <strong>Start Streaming</strong> to begin,
//         and <strong>Stop Streaming</strong> when finished.
//       </p>

//       <button
//             className="cursor-pointer text-base px-6 py-3 m-2 border-none rounded transition-opacity duration-200 hover:opacity-90 focus:outline-none bg-blue-700 text-white"
//             onClick={handleStartStream}
//         >
//             Start Streaming
//       </button>
//       <button
//             className="cursor-pointer text-base px-6 py-3 m-2 border-none rounded transition-opacity duration-200 hover:opacity-90 focus:outline-none bg-red-600 text-white"
//             onClick={handleStopStream}
//         >
//             Stop Streaming
//       </button>
//     </div>
//   )
// }

// export default App
