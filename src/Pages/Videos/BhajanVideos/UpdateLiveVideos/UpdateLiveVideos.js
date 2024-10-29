import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL, WEB_BASE_URL } from "utils/config";

const UpdateLiveVideo = ({ onSuccess, id }) => {
  const [formData, setFormData] = useState({
    videoLink: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  // Fetch existing data when the component mounts
  useEffect(() => {
    const fetchBhashanData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const token = Cookies.get("token");
          const response = await fetch(`${API_BASE_URL}/bhashan/getBhashanById/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch bhashan data");
          }

          const result = await response.json();
          setFormData({
            videoLink: result.data.videoLink,
            image: null, // Keep image handling separate
          });
          setImagePreview(result.data.image); // Assuming imageUrl is the property name
        } catch (error) {
          toast.error("Error fetching bhashan data: " + error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBhashanData();
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
      } else {
        imageUrl = imagePreview; // Use existing image URL if no new image is uploaded
      }

      const submissionData = {
        videoLink: formData.videoLink,
        image : imageUrl, // Include the image URL
      };

      const token = Cookies.get("token");
      const response = await fetch(
        `${API_BASE_URL}/bhashan/updateBhashan/${id}`, // Assuming update endpoint
        {
          method: "PUT",
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

      toast.success("Bhajan updated successfully!");
      onSuccess();

      setFormData({
        videoLink: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      toast.error("Error updating bhajan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const headings = {
    videoLink: "Video Link:",
    uploadImage: "Upload Image:",
    submit: "Update Bhajan",
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <ToastContainer position="top-right" autoClose={5000} />
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
                src={WEB_BASE_URL + "/" + imagePreview}
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

export default UpdateLiveVideo;
