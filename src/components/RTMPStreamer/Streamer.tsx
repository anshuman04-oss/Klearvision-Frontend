/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const Streamer: FC = () => {
    const userVideoRef = useRef<HTMLVideoElement>(null)
    const [mediaStream, setMediaStream] = useState<MediaStream | null> (null)
    const [socket, setSocket] = useState<Socket | null> (null)

    useEffect(() => {
        const socketInstance = io('http://localhost:5000')
        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    const handleStartStreaming = () => {
        if(!mediaStream) {
            console.error('No media stream available')
            return;
        }

        const mediaRecorder = new MediaRecorder(mediaStream, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
        })

        mediaRecorder.ondataavailable = (e: BlobEvent) => {
            console.log('Binary stream available', e.data)
            if(socket) {
                socket.emit('binarystream', e.data)
            }
        }

        mediaRecorder.start(25)
    };

    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const media = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                })
                setMediaStream(media)
                if(userVideoRef.current) {
                    userVideoRef.current.srcObject = media;
                }
            } catch (error) {
                console.log('Error accessing media devices', error)
            }
        }

        initializeMedia();
    }, []);

    return (
        <>
            <div className='flex flex-col items-start justify-center min-h-screen bg-gray-700 ml-5'>
                <h1 className='text-3xl font-bold mb-3 text-gray-900'>Live Video Streaming</h1>
                <div className='relative w-1/4 max-w-3xl aspect-w-16 aspect-h-9 mb-4'>
                    <video 
                        ref={userVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className='w-full h-full rounded-lg border border-gray-300 shadow-md mb-1'
                    />
                    <button
                        onClick={handleStartStreaming}
                        className='px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
                    >
                        Start Streaming
                    </button>
                </div>
            </div>
        </>
    )
}

export default Streamer;