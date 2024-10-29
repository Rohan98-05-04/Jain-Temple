import Section from "@aio/components/Section";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "src/components/Spinner";
import { API_BASE_URL, WEB_BASE_URL } from "utils/config";

const UpdateGallery = ({ galleryId, onSuccess }) => {
  const [formData, setFormData] = useState({
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const fetchGallery = async () => {
      const token = Cookies.get("token");
      try {
        const response = await fetch(`${API_BASE_URL}/gallery/getGalleryById/${galleryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch gallery");
        }

        setFormData({ images: data.data.image });
        setImagePreviews(data.data.image);
      } catch (error) {
        toast.error("Error: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [galleryId]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      for (const file of files) {
        await uploadImage(file);
      }
    }
  };

  const uploadImage = async (image) => {
    const uploadData = new FormData();
    uploadData.append("image", image);

    const token = Cookies.get("token");
    try {
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
        images: [...prev.images, uploadedImageUrl],
      }));
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...imagePreviews];
    updatedImages.splice(index, 1); // Remove the image at the given index
    setImagePreviews(updatedImages);

    // Also remove from formData
    setFormData((prev) => ({
      images: prev.images.filter((_, i) => i !== index), // Remove from the images array
    }));
  };

  const updateGallery = async () => {
    const galleryData = {
      image: formData.images,
    };

    const token = Cookies.get("token");
    try {
      const galleryResponse = await fetch(`${API_BASE_URL}/gallery/updateGallery/${galleryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryData),
      });

      const galleryResponseData = await galleryResponse.json();

      if (!galleryResponse.ok) {
        throw new Error(galleryResponseData.message || "Failed to update gallery");
      }

      toast.success("Gallery updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const headings = {
    uploadImages: language === "hi" ? "छवि अपलोड करें:" : "Upload Images:",
    submitGallery: language === "hi" ? "गैलरी अपडेट करें" : "Update Gallery",
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
              multiple
              className="mt-1 border border-gray-300 rounded p-2 w-full"
            />
          </label>
          {imagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 relative">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={WEB_BASE_URL + "/" + preview}
                    alt={`Preview ${index + 1}`}
                    className="border border-gray-300 rounded"
                    style={{ maxHeight: "200px", maxWidth: "100px" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    style={{ margin: "5px" }}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            className="mt-4 p-2 bg-green-500 text-white rounded"
            onClick={updateGallery}
          >
            {headings.submitGallery}
          </button>
        </div>
      </form>
    </Section>
  );
};

export default UpdateGallery;
