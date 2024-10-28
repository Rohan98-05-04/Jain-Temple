import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

const AddLiveVideo = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    videoLink: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submissionData = {
        videoLink: formData.fullname,
      };

      console.log("Submission Data:", submissionData);

      // Retrieve token (this example assumes it's in local storage)
      const token = Cookies.get("token");

      const response = await fetch(
        `${API_BASE_URL}/liveDarshan/createLiveDarshan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token here
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const result = await response.json();
      toast.success("Bhajan submitted successfully!");
      onSuccess();

      setFormData({
        videoLink: "",
      });
    } catch (error) {
      toast.error("Error submitting donation: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };



  const [language, setLanguage] = useState("en"); // Default language is English

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const isHindi = language === "hi";

  const headings = {
    fullName: isHindi ? "वीडियो का लिंक:" : "Video Link:",
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

      <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-white ">
        <div className="grid md:grid-cols-3 gap-4">
          <label className="block">
            {headings.fullName}
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter Video Link"
              required
              className="input mt-1 border border-gray-300 rounded p-2 w-full"
            />
          </label>
        </div>

        {/* Submit Button */}
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
