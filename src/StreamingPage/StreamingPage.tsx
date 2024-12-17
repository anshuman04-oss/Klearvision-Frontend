import React from 'react'
import FilePicker from './StreamingPageComponents/FilePicker'
import CameraAccess from './StreamingPageComponents/CameraAccess'


function StreamingPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className='text-center text-5xl mt-6 font-bold'>Video Streaming</h1>
        <div className="w-full max-w-2xl space-y-6 mt-8">
          <FilePicker />
          <CameraAccess />
        </div>
      </div>
    </>
  )
}

export default StreamingPage
