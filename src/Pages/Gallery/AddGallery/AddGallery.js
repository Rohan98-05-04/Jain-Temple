import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

const AddGallery = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    images: [], // Array to hold multiple images
  });
  const [imagePreviews, setImagePreviews] = useState([]); // Array for image previews
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImagePreviews((prev) => [
        ...prev,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
      for (const file of files) {
        await uploadImage(file);
      }
    }
  };

  const uploadImage = async (image) => {
    const uploadData = new FormData();
    uploadData.append("image", image); // Append the single image

    const token = Cookies.get("token");
    try {
      setIsLoading(true);
      const uploadResponse = await fetch(`${API_BASE_URL}/auth/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const uploadResponseData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResponseData.message || "Failed to upload image");
      }
      const uploadedImageUrl = uploadResponseData.imageUrl; 
      setFormData((prev) => ({
        images: [...prev.images, uploadedImageUrl], // Ensure the uploaded URL is added correctly
      }));
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createGallery = async () => {
    const galleryData = {
      image: formData.images, // Ensure no null or undefined values are sent
    };

    const token = Cookies.get("token");
    try {
      const galleryResponse = await fetch(`${API_BASE_URL}/gallery/createGallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryData),
      });

      const galleryResponseData = await galleryResponse.json();

      if (!galleryResponse.ok) {
        throw new Error(galleryResponseData.message || "Failed to create gallery");
      }

      toast.success("Gallery created successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const isHindi = language === "hi";

  const headings = {
    uploadImages: isHindi ? "छवि अपलोड करें:" : "Upload Images:",
    submitGallery: isHindi ? "गैलरी सबमिट करें" : "Submit Gallery",
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="ml-6 mb-4">
        <label>Choose the language: </label>
        <button
          onClick={() => toggleLanguage("en")}
          className={`py-2 px-4 rounded-lg ml-2 transition-colors ${
            language === "en"
              ? "bg-orange-400 text-white"
              : "text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white"
          }`}
        >
          English
        </button>
        <button
          onClick={() => toggleLanguage("hi")}
          className={`py-2 px-4 rounded-lg ml-4 transition-colors ${
            language === "hi"
              ? "bg-orange-400 text-white"
              : "text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white"
          }`}
        >
          हिंदी
        </button>
      </div>

      <form className="space-y-2 p-4 bg-white">
        <div className="grid">
          <label className="block">
            {headings.uploadImages}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple // Allow multiple files
              className="mt-1 border border-gray-300 rounded p-2 w-full"
            />
          </label>
          {imagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="border border-gray-300 rounded"
                  style={{ maxHeight: "200px", maxWidth: "100px" }} // Adjust size as needed
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            type="button" // Change to button to prevent form submission
            className="mt-4 p-2 bg-green-500 text-white rounded"
            onClick={createGallery} // Trigger gallery creation
          >
            {headings.submitGallery}
          </button>
        </div>
      </form>
    </Section>
  );
};

export default AddGallery;
