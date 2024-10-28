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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    if (files.length > 0) {
      setFormData({ images: files }); // Update state with the selected files
      const previews = files.map((file) => URL.createObjectURL(file)); // Create previews for all files
      setImagePreviews(previews); // Set the previews state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submissionData = new FormData();
      formData.images.forEach((image) => {
        submissionData.append("image", image); // Append each image with array notation
      });

      const token = Cookies.get("token");
      const response = await fetch(`${API_BASE_URL}/gallery/createGallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not set Content-Type for FormData
        },
        body: submissionData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Network response was not ok");
      }

      toast.success("Gallery created successfully!");
      onSuccess();
      setFormData({ images: [] });
      setImagePreviews([]);
    } catch (error) {
      toast.error("Error creating gallery: " + error.message);
    } finally {
      setIsLoading(false);
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

      <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-white">
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
            type="submit"
            className="mt-4 p-2 bg-green-500 text-white rounded"
          >
            {headings.submitGallery}
          </button>
        </div>
      </form>
    </Section>
  );
};

export default AddGallery;
