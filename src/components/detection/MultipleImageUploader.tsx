import { useState, ChangeEvent } from "react";
import axios from "axios";
import { UPLOAD_BASE_URL } from "../../constants";

const MultiImageUploader: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImages(files);
    }
  };

  const uploadAndProcessImages = async (): Promise<void> => {
    if (selectedImages.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post<{ processedImageUrls: string[] }>(
        `${UPLOAD_BASE_URL}/upload/multiple`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProcessedImages(response.data.processedImageUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-semibold mb-6">Multiple Image Uploader</h2>
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={handleFileChange}
        className="mb-4" 
      />
      <button 
        onClick={uploadAndProcessImages} 
        disabled={selectedImages.length === 0}
        className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors ${selectedImages.length === 0 && 'opacity-50 cursor-not-allowed'}`}
      >
        Upload & Process
      </button>
      {loading && <p className="mt-4">Processing...</p>}
      {processedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Processed Images:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedImages.map((imageUrl, index) => (
              <div key={index} className="flex flex-col items-center">
                <img 
                  src={imageUrl} 
                  alt={`Processed ${index}`} 
                  className="max-w-xs rounded-lg shadow-lg" 
                />
                <a href={imageUrl} download={`processed-image-${index + 1}.jpg`}>
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mt-4">
                    Download
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;