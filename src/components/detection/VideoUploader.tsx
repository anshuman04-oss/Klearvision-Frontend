import { useState, ChangeEvent } from "react";
import axios from "axios";
import { UPLOAD_BASE_URL } from "../../constants";
import { Alert, CircularProgress } from "@mui/material";

const VideoUploader: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedVideo(event.target.files[0]);
      setError(null);
    }
  };

  const uploadAndProcessVideo = async (): Promise<void> => {
    if (!selectedVideo) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", selectedVideo);

    try {
      
      const response = await axios.post<{ processedVideoUrl: string; message?: string }>(
        `${UPLOAD_BASE_URL}/upload/video`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data"
          },
          timeout: 300000,
          withCredentials: false
        }
      );

      if (response.status >= 400) {
        throw new Error(response.data.message || 'Upload failed');
      }

      setProcessedVideo(response.data.processedVideoUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setError("Upload timed out. Please try again with a smaller file or check your connection.");
        } else if (error.code === "ERR_NETWORK") {
          setError("Cannot connect to the server. Please check if the server is running and accessible.");
        } else if (error.response) {
          setError(`Server error: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
          setError("Network error. Please check your internet connection.");
        } else {
          setError(`Upload failed: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred during upload.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-semibold mb-6">Video Uploader</h2>
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange}
        className="mb-4" 
      />
      <button 
        onClick={uploadAndProcessVideo} 
        disabled={!selectedVideo || loading}
        className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors ${(!selectedVideo || loading) && 'opacity-50 cursor-not-allowed'}`}
      >
        {loading ? (
          <span className="flex items-center">
            <CircularProgress size={20} color="inherit" className="mr-2" />
            Processing...
          </span>
        ) : (
          'Upload & Process'
        )}
      </button>
      {loading && (
        <div className="mt-4">
          <CircularProgress />
          <p className="mt-2">Processing your video...</p>
        </div>
      )}
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