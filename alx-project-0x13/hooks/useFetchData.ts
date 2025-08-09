import { ImageProps } from "@/interfaces";
import { useState } from "react";

// This is a generic custom hook. <T> is the type of the response data,
// and <R> is the type of the request body.
const useFetchData = <T, R extends { prompt?: string }>() => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);

  const fetchData = async (endpoint: string, body: R) => {
    setIsLoading(true);
    setError(null);
    setResponseData(null); // Clear previous response
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!resp.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await resp.json();
      setResponseData(result);

      // Add the new image to the history
      if (result?.message && body?.prompt) {
        setGeneratedImages((prev) => [...prev, { imageUrl: result.message, prompt: body.prompt! }]);
      }

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    responseData,
    error,
    fetchData,
    generatedImages,
    setGeneratedImages // Exporting the setter can be useful
  };
};

export default useFetchData;