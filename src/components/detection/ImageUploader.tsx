import { useState, ChangeEvent } from "react";
import axios from "axios";
import { UPLOAD_BASE_URL } from "../../constants";

const ImageUploader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const uploadAndProcessImage = async (): Promise<void> => {
    if (!selectedImage) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post<{ processedImageUrl: string }>(
        `${UPLOAD_BASE_URL}/upload/single`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", response.data);

      setProcessedImage(response.data.processedImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-semibold mb-6">Image Uploader</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        className="mb-4" 
      />
      <button 
        onClick={uploadAndProcessImage} 
        disabled={!selectedImage}
        className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors ${!selectedImage && 'opacity-50 cursor-not-allowed'}`}
      >
        Upload & Process
      </button>
      {loading && <p className="mt-4">Processing...</p>}
      {processedImage && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Processed Image:</h3>
          <img 
            src={processedImage} 
            alt="Processed" 
            className="max-w-md mx-auto rounded-lg shadow-lg" 
          />
          <a href={processedImage} download="processed-image.jpg">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mt-4">
              Download
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;