import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

const UpdateGallery = ({ onSuccess, galleryId }) => {
  const [formData, setFormData] = useState({
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (galleryId) {
      fetchGalleryData(galleryId);
    }
  }, [galleryId]);

  const fetchGalleryData = async (id) => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_BASE_URL}/gallery/getGalleryById/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch gallery data");
      }

      const data = await response.json();
      if (data.success) {
        const image = data.data; // Assuming data.data is an array
        setFormData({ image });
        setImagePreview(image.image); // Use the existing image URL for the preview
      } else {
        throw new Error("Gallery not found");
      }
    } catch (error) {
      toast.error("Error fetching gallery: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only handle the first file
    if (file) {
      setFormData({ image: file });
      setImagePreview(URL.createObjectURL(file)); // Set the preview for the selected file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submissionData = new FormData();
      submissionData.append("image", formData.image); // Append the single image

      const token = Cookies.get("token");
      const response = await fetch(`${API_BASE_URL}/gallery/updateGallery/${galleryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Network response was not ok");
      }

      toast.success("Gallery updated successfully!");
      onSuccess();
      setFormData({ image: null });
      setImagePreview(null);
    } catch (error) {
      toast.error("Error updating gallery: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const isHindi = language === "hi";

  const headings = {
    uploadImage: isHindi ? "छवि अपलोड करें:" : "Upload Image:",
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
            {headings.uploadImage}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 border border-gray-300 rounded p-2 w-full"
            />
          </label>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="border border-gray-300 rounded"
                style={{ maxHeight: "200px", maxWidth: "100px" }}
              />
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

export default UpdateGallery;
