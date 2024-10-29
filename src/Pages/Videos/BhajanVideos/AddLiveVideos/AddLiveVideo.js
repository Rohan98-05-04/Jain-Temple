import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

const AddLiveVideo = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    videoLink: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImage = async (imageFile) => {
    const token = Cookies.get("token");
    const imageData = new FormData();
    imageData.append("image", imageFile);

    const response = await fetch(`${API_BASE_URL}/auth/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: imageData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Image upload failed");
    }

    const result = await response.json();
    return result.imageUrl; // Assuming the response contains the uploaded image URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageUrl = null;

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const submissionData = {
        videoLink: formData.videoLink,
        image : imageUrl, // Include the image URL
      };

      const token = Cookies.get("token");
      const response = await fetch(
        `${API_BASE_URL}/bhashan/createBhashan`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      toast.success("Bhajan submitted successfully!");
      onSuccess();

      setFormData({
        videoLink: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      toast.error("Error submitting donation: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const isHindi = language === "hi";

  const headings = {
    videoLink: isHindi ? "वीडियो का लिंक:" : "Video Link:",
    uploadImage: isHindi ? "छवि अपलोड करें:" : "Upload Image:",
    submit: isHindi ? "दान सबमिट करें" : "Submit Bhajan",
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="ml-6 mb-4">
        <label>Choose the language : </label>
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
                alt="Image Preview"
                className="border border-gray-300 rounded mt-2"
                style={{ maxHeight: "200px", maxWidth: "100%" }}
              />
            </div>
          )}
          <label className="block mt-6">
            {headings.videoLink}
            <input
              type="text"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              placeholder="Enter Video Link"
              required
              className="mt-1 border border-gray-300 rounded p-2 w-full"
            />
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="mt-4 p-2 bg-green-500 text-white rounded"
          >
            {headings.submit}
          </button>
        </div>
      </form>
    </Section>
  );
};

export default AddLiveVideo;
