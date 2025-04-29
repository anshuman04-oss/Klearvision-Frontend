import { useState, ChangeEvent } from "react";
import axios from "axios";
import { UPLOAD_BASE_URL } from "../../constants";
const VideoUploader: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files[0] + "Exists in handleFileChange");
      setSelectedVideo(event.target.files[0]);
    }
  };

  const uploadAndProcessVideo = async (): Promise<void> => {
    if (!selectedVideo) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("video", selectedVideo);

    console.log("Form data exists", formData)
    console.log("Form data size:", Array.from(formData.entries()).length);

    try {
      const response = await axios.post(
        `${UPLOAD_BASE_URL}/upload/video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // console.log("Response: ", response.data);

      setProcessedVideo(response.data.processedVideoUrl);
    } catch (error) {
      console.log("Error uploading video:", error);
    } finally {
      setLoading(false);
    }

    // console.log("Processed video: ", processedVideo);
  };

  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-semibold mb-6">Video Uploader</h2>
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange}
        className="mb-4" 
      />
      <button 
        onClick={uploadAndProcessVideo} 
        disabled={!selectedVideo}
        className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors ${!selectedVideo && 'opacity-50 cursor-not-allowed'}`}
      >
        Upload & Process
      </button>
      {loading && <p className="mt-4">Processing...</p>}
      {processedVideo && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Processed Video:</h3>
          <video className="max-w-md mx-auto rounded-lg shadow-lg" width="300" controls>
            <source src={processedVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a href={processedVideo} download="processed-video.mp4">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mt-4">
              Download
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;