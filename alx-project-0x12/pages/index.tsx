import ImageCard from "@/components/common/ImageCard";
import useFetchData from "@/hooks/useFetchData";
import { ImageProps } from "@/interfaces";
import React, { useEffect, useState } from "react";

// Define the shape of the expected API response
type ApiResponse = {
  message: string;
};

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  // This state is now only for the main displayed image
  const [imageUrl, setImageUrl] = useState<string>("");

  // Use our custom hook to manage all API state and logic
  const { isLoading, responseData, generatedImages, fetchData } = useFetchData<ApiResponse, { prompt: string }>();

  // This function is now incredibly simple: just call the hook's fetchData function
  const handleGenerateImage = () => {
    if (prompt) {
      fetchData('/api/generate-image', { prompt });
    }
  };

  // This effect runs whenever the API call finishes (when responseData changes)
  useEffect(() => {
    if (responseData?.message) {
      setImageUrl(responseData.message);
    }
  }, [responseData]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-2">Image Generation App</h1>
        <p className="text-lg text-gray-700 mb-6">
          Generate stunning images based on your prompts!
        </p>

        <div className="w-full max-w-md mx-auto">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateImage}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </div>

        {/* Display the main image */}
        {imageUrl && !isLoading && (
          <div className="flex justify-center mt-6">
            <ImageCard action={() => setImageUrl(imageUrl)} imageUrl={imageUrl} prompt={prompt} />
          </div>
        )}
      </div>
      
      {/* Display the image history gallery */}
      {generatedImages.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mt-12">
            <h3 className="text-2xl font-bold text-center mb-4">Your Generated Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t pt-4">
              {generatedImages.map(
                ({ imageUrl, prompt }: ImageProps, index) => (
                  <ImageCard
                    action={() => setImageUrl(imageUrl)}
                    imageUrl={imageUrl}
                    prompt={prompt}
                    key={index}
                    width="w-full"
                    height="h-40"
                  />
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Home;