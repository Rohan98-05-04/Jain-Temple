import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";
import { useRouter } from "next/router"; // Import useRouter for routing

const EditLiveVideo = ({ id, onSuccess }) => {
  const [formData, setFormData] = useState({
    videoLink: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submissionData = {
        videoLink: formData.videoLink, // Use videoLink directly
      };

      const token = Cookies.get("token");

      const response = await fetch(
        `${API_BASE_URL}/liveDarshan/updateLiveDarshan/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      toast.success("Live video updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Error updating live video: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchLiveVideo = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${API_BASE_URL}/liveDarshan/getLiveDarshanById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Network response was not ok");
        }

        const data = await response.json();
        setFormData({ videoLink: data.data.videoLink });
      } catch (error) {
        toast.error("Error fetching live video: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLiveVideo();
    }
  }, [id]);

  const [language, setLanguage] = useState("en");

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const isHindi = language === "hi";

  const headings = {
    videoLink: isHindi ? "वीडियो का लिंक:" : "Video Link:",
    submit: isHindi ? "वीडियो अपडेट करें" : "Update Video",
  };

  if (isLoading) return <Spinner />;

  return (
    <Section>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="ml-6 mb-4">
        <label>Choose the language:</label>
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
        <div className="grid md:grid-cols-3 gap-4">
          <label className="block">
            {headings.videoLink}
            <input
              type="text"
              name="videoLink" // Changed to videoLink
              value={formData.videoLink} // Correct state value
              onChange={handleChange}
              placeholder="Enter Video Link"
              required
              className="input mt-1 border border-gray-300 rounded p-2 w-full"
            />
          </label>
        </div>
        

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 p-2 ${
              isSubmitting ? "bg-gray-300" : "bg-green-500"
            } text-white rounded`}
          >
            {headings.submit}
          </button>
        </div>
      </form>
    </Section>
  );
};

export default EditLiveVideo;
