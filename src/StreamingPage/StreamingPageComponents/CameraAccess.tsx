import React, { useRef, useEffect, useState } from 'react'

function CameraAccess() {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (error) {
            console.error("Camera access error:", error);
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    }

    useEffect(() => {
        return () => stopCamera(); // Clean up stream on unmount
    }, [stream])

    return (
        <>
            <div className="p-4 border rounded-md shadow-md mt-4">
                <h2 className="text-xl font-semibold mb-2">Live Camera stream</h2>
                <div className="flex gap-2">
                    <button
                        onClick={startCamera}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Start Camera
                    </button>
                    <button
                        onClick={stopCamera}
                        disabled={!stream}
                        className={`${stream ? "bg-red-500 hover:bg-red-600" : "bg-gray-400"} text-white px-4 py-2 rounded`}>
                        Stop Camera
                    </button>
                </div>

                <video ref={videoRef} autoPlay className="w-full max-w-md mt-4 rounded-lg" />
            </div>

        </>
    )
}

export default CameraAccess
