// import React, { useState } from 'react'
// import axios from 'axios'

// function ImageInput() {
//     // Take image input, send it to server, receive from the server and return a file which the user can download.
//     const [image, setImage] = useState<File | null> (null)

//     const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if(event.target.files && event.target.files[0]) {
//             setImage(event.target.files[0]);
//         }
//     }

//     const handleUpload = () => {
//         // Here, we will call the api for 
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
//   <input 
//     type="file" 
//     accept="image/*" 
//     onChange={(event) => handleImage(event)} 
//     className="p-3 border border-gray-300 rounded-lg shadow-sm w-64 text-lg"
//   />
//   <button 
//     onClick={handleUpload} 
//     className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
//   >
//     Upload
//   </button>
// </div>

//     )
// }

// export default ImageInput
