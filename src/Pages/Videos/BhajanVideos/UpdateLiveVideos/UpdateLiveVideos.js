import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

const EditLiveVideo = ({ id, onSuccess }) => {
  const [formData, setFormData] = useState({
    videoLink: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const fetchBhashan = async () => {
      setIsFetching(true);
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${API_BASE_URL}/bhashan/getBhashanById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bhashan data");
        }

        const data = await response.json();
        setFormData({
          videoLink: data.data.videoLink || "",
          image: null,
        });
        setImagePreview(data.data.image || null);
      } catch (error) {
        toast.error("Error fetching bhashan data: " + error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchBhashan();
  }, [id]);

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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const submissionData = new FormData();
    submissionData.append("videoLink", formData.videoLink);
    if (formData.image) {
      submissionData.append("image", formData.image || imagePreview);
    }

    const token = Cookies.get("token");
    const response = await fetch(
      `${API_BASE_URL}/bhashan/updateBhashan/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not set Content-Type here
        },
        body: submissionData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Network response was not ok");
    }

    toast.success("Bhajan updated successfully!");
    onSuccess();

    // Fetch updated bhashan data to confirm changes
    await fetchUpdatedBhashan();

    // Reset form data
    setFormData({ videoLink: "", image: null });
    setImagePreview(null);
  } catch (error) {
    toast.error("Error updating bhashan: " + error.message);
  } finally {
    setIsLoading(false);
  }
};


  const fetchUpdatedBhashan = async () => {
    const token = Cookies.get("token");
    const response = await fetch(
      `${API_BASE_URL}/bhashan/getBhashanById/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Updated bhashan data:", data); // Check the updated data
      // Optionally update local state if needed
    } else {
      console.error("Failed to fetch updated bhashan data");
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const isHindi = language === "hi";

  const headings = {
    videoLink: isHindi ? "वीडियो का लिंक:" : "Video Link:",
    uploadImage: isHindi ? "छवि अपलोड करें:" : "Upload Image:",
    submit: isHindi ? "दान सबमिट करें" : "Update Bhajan",
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      {isFetching && <Spinner />}
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

export default EditLiveVideo;
