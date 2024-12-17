import React, {ChangeEvent, useState} from 'react'
// import axios from 'axios';
// type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

function FilePicker() {

    const [fileURL, setFileURL] = useState<string | null>(null);
    // const [status, setStatus] = useState<UploadStatus>("idle");

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if(file) {
            setFileURL(URL.createObjectURL(file));
        }
    }

    // async function handleFileUpload() {
    //     if(!file) return;

    //     setStatus('uploading')
    //     const formData = new FormData();
    //     formData.append('file', file)

    //     try{
    //         await axios.post("URL",{

    //         })
    //         setStatus('uploaded')
    //     } catch{
    //         setStatus('error')
    //     }
    // }

    return (
     <>
     <div>
     <h2 className="text-xl font-semibold mb-2">Pick a File to Stream</h2>
        <div>
            <input type="file"
            accept="video/*,audio/*,image/*" 
            onChange={handleFileChange}
            className="file:cursor-pointer file:rounded file:bg-blue-500 file:text-white file:p-2" />
        </div>

        {/* {file && status!='uploading' && <button onClick={handleFileUpload}>Upload</button>} */}

        {fileURL && (
            <div className='mt-4'>
            <h3 className="text-lg mb-2">File ready for streaming:</h3>
            <video src={fileURL} controls autoPlay className="w-full max-w-md rounded-lg"></video>
            </div>
        )}
        
        {/* {status === 'uploaded' && (
        <p className="text-sm text-green-600">File uploaded successfully!</p>)}
        
        {status === 'error' && (
            <p className="text-sm text-red-600">Upload failed. Please try again.</p>)} */}
    </div>
    </>
    )
}

export default FilePicker
