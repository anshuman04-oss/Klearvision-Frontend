import React, { useRef, useEffect } from 'react';

const VideoStreamer = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const handleStream = useEffect(() => {
        // Initialize WebSocket
        wsRef.current = new WebSocket('ws://localhost:5000');
        wsRef.current.onopen = () => console.log('WebSocket connected.');

        // Access user's webcam
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm; codecs=vp8',
                });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(event.data);
                    }
                };

                mediaRecorder.start(100); // Send video chunks every 100ms
            })
            .catch((err) => console.error('Error accessing webcam:', err));

        return () => {
            wsRef.current?.close();
        };
    }, []);

    return (
        <>
            <div className='flex flex-col items-start justify-center min-h-screen bg-gray-700 ml-5'>
                <h1 className='text-3xl font-bold mb-3 text-gray-900'>Live Video Streaming</h1>
                <div className='relative w-1/4 max-w-3xl aspect-w-16 aspect-h-9 mb-4'>
                    <video 
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className='w-full h-full rounded-lg border border-gray-300 shadow-md mb-1'
                    />
                    <button
                        onClick={}
                        className='px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
                    >
                        Start Streaming
                    </button>
                </div>
            </div>
        </>
    )
};

export default VideoStreamer;

































// import React from 'react'

// function Streamer() {

//     return (
//         <>
//             <object>
//                 <embed id="rtmp-streamer" src="../RtmpStreamer.swf" bgcolor="#999999" quality="high"
//                     width="320" height="240" allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></embed>
//             </object>
//         </>
//     )
// }

// export default Streamer



// ffmpeg -re -i /home/anshuman/development/klearvision/KlearVisenWebApp/src/public/SampleVideo_360x240_2mb.mp4 -c:v libx264 -b:v 1000k -c:a aac -f flv rtmp://VideoProcessingServerASG-NLB-49b63e78c9aa7744.elb.ap-south-1.amazonaws.com:443/live/sk_53RKgM8XBON1ZxHvtDifbd_9vXJVnl5n4LUcZ3JGTGgh7va0bLdFf





























/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useRef, useState } from 'react';
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';

// const Streamer: React.FC = () => {
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const [mediaStream, setMediaStream] = useState<MediaStream | null> (null)

//     useEffect(() => {
//         if(videoRef.current) {
//             const player = videojs(videoRef.current, {
//                 autoplay: true,
//                 controls: true,
//                 sources: [
//                     {
//                         src: 'rtmp://VideoProcessingServerASG-NLB-49b63e78c9aa7744.elb.ap-south-1.amazonaws.com:443/live/sk_53RKgM8XBON1ZxHvtDifbd_9vXJVnl5n4LUcZ3JGTGgh7va0bLdFf',
//                         type: 'rtmp/flv',
//                     },
//                 ],
//             });

//             return () => {
//                 player.dispose();
//             }
//         }
//     }, []);

//     const handleStartStreaming = () => {
//         if(!mediaStream) {
//             console.error("No media stream available")
//             return
//         }

//         const mediaRecorder = new MediaRecorder(mediaStream, {
//             audioBitsPerSecond: 128000,
//             videoBitsPerSecond: 2500000,
//         })

//         mediaRecorder.ondataavailable = (e: BlobEvent) => {
//             console.log('Binary stream available', e.data)
//         }

//         mediaRecorder.start(25)
//     }

//     useEffect(() => {
//         const initializeMedia = async () => {
//             try {
//                 const media = await navigator.mediaDevices.getUserMedia({
//                     audio: true,
//                     video: true
//                 })
//                 setMediaStream(media)
//                 if(videoRef.current) {
//                     videoRef.current.srcObject = media;
//                 }
//             } catch (error) {
//                 console.log('Error accessing media devices', error)
//             }
//         }

//         initializeMedia();
//     }, []);

    // return (
    //     <>
    //         <div className='flex flex-col items-start justify-center min-h-screen bg-gray-700 ml-5'>
    //             <h1 className='text-3xl font-bold mb-3 text-gray-900'>Live Video Streaming</h1>
    //             <div className='relative w-1/4 max-w-3xl aspect-w-16 aspect-h-9 mb-4'>
    //                 <video 
    //                     ref={videoRef}
    //                     autoPlay
    //                     muted
    //                     playsInline
    //                     className='w-full h-full rounded-lg border border-gray-300 shadow-md mb-1'
    //                 />
    //                 <button
    //                     onClick={handleStartStreaming}
    //                     className='px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
    //                 >
    //                     Start Streaming
    //                 </button>
    //             </div>
    //         </div>
    //     </>
    // )
// }

// export default Streamer;












































// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { FC, useEffect, useRef, useState } from 'react';
// import io, { Socket } from 'socket.io-client';


// const Streamer: FC = () => {
//     const userVideoRef = useRef<HTMLVideoElement>(null)
//     const [mediaStream, setMediaStream] = useState<MediaStream | null> (null)
//     const [socket, setSocket] = useState<Socket | null> (null)

//     useEffect(() => {
//         const socketInstance = io('http://localhost:5000')
//         setSocket(socketInstance)

//         return () => {
//             socketInstance.disconnect()
//         }
//     }, [])

//     const handleStartStreaming = () => {
//         if(!mediaStream) {
//             console.error('No media stream available')
//             return;
//         }

        // const mediaRecorder = new MediaRecorder(mediaStream, {
        //     audioBitsPerSecond: 128000,
        //     videoBitsPerSecond: 2500000,
        // })

        // mediaRecorder.ondataavailable = (e: BlobEvent) => {
        //     console.log('Binary stream available', e.data)
        //     if(socket) {
        //         socket.emit('binarystream', e.data)
        //     }
        // }

//         mediaRecorder.start(25)
//     };

    // useEffect(() => {
    //     const initializeMedia = async () => {
    //         try {
    //             const media = await navigator.mediaDevices.getUserMedia({
    //                 audio: true,
    //                 video: true
    //             })
    //             setMediaStream(media)
    //             if(userVideoRef.current) {
    //                 userVideoRef.current.srcObject = media;
    //             }
    //         } catch (error) {
    //             console.log('Error accessing media devices', error)
    //         }
    //     }

    //     initializeMedia();
    // }, []);

    // return (
    //     <>
    //         <div className='flex flex-col items-start justify-center min-h-screen bg-gray-700 ml-5'>
    //             <h1 className='text-3xl font-bold mb-3 text-gray-900'>Live Video Streaming</h1>
    //             <div className='relative w-1/4 max-w-3xl aspect-w-16 aspect-h-9 mb-4'>
    //                 <video 
    //                     ref={userVideoRef}
    //                     autoPlay
    //                     muted
    //                     playsInline
    //                     className='w-full h-full rounded-lg border border-gray-300 shadow-md mb-1'
    //                 />
    //                 <button
    //                     onClick={handleStartStreaming}
    //                     className='px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
    //                 >
    //                     Start Streaming
    //                 </button>
    //             </div>
    //         </div>
    //     </>
    // )
// }

// export default Streamer;