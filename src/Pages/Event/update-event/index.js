import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL, WEB_BASE_URL } from "../../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import { ToastContainer, toast } from "react-toastify";
import Section from "@aio/components/Section";
import styles from "../event.module.css";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../components/Spinner";
import { useRef } from "react";

export default function UpdateEvent({ eventId, onSuccess }) {
  const [eventName, setEventName] = useState("");
  const [eventDetail, setEventDetail] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [existingEventCategory, setExistingEventCategory] = useState([]);
  const [eventCategory, setEventCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = token || "";

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/event/getAllCategory`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parseToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setExistingEventCategory(data.data || []);
        } else {
          const errorData = await response.json();
          toast.error(errorData.errorMessage || "Failed to fetch categories.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (err) {
        toast.error("Network error: " + err.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    const fetchEventData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/event/getevent/${eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${parseToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const {
            startDate: start,
            endDate: end,
            eventName,
            eventDetail,
            eventCategory,
            image,
          } = data.data;

          setStartDate(new Date(start));
          setEndDate(new Date(end));
          setEventName(eventName);
          setEventDetail(eventDetail);
          setEventCategory(eventCategory.map((cat) => cat._id));
          setUploadedImage(image);
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.errorMessage || "Failed to fetch event details.",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }
      } catch (err) {
        toast.error("Network error: " + err.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    fetchData();
    fetchEventData();
  }, [eventId]);

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const onSelect = (selectedList) => {
    setEventCategory(selectedList.map((item) => item.key));
  };

  const onRemove = (selectedList) => {
    setEventCategory(selectedList.map((item) => item.key));
  };

  const uploadImage = async () => {
    const token = localStorage.getItem("token");
    const parseToken = token || "";
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${parseToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl; // Adjust based on your API response
      } else {
        const errorData = await response.json();
        toast.error(errorData.errorMessage || "Image upload failed.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      toast.error("Network error: " + err.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return null; // In case of failure
  };

  const updateEvent = async () => {
    if (
      !eventName.trim() ||
      !eventDetail.trim() ||
      !startDate ||
      !endDate ||
      eventCategory.length === 0
    ) {
      toast.error("Please fill all required fields.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setIsLoading(true);
    let imageUrl = uploadedImage; // Default to existing image URL

    if (image) {
      imageUrl = await uploadImage(); // Upload the new image and get the URL
      if (!imageUrl) {
        setIsLoading(false);
        return; // Stop if the image upload failed
      }
    }

    const eventData = {
      eventName,
      eventDetail,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      eventCategory,
      image: imageUrl, // Use the new or existing image URL
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/event/updateevent/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      if (response.ok) {
        toast.success("Event updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.errorMessage || "Failed to update event.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      toast.error("Network error: " + err.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <div className="donarPage">
        <ToastContainer position="top-right" autoClose={5000} />

        <div className="addDonarForm">
          <h2 className={styles.formHeaderext}>Update Event Details</h2>
          <form>
            <div className="formMainDiv">
              <div className="label-form eventInp">
                <label htmlFor="name">Event Name</label>
                <input
                  type="text"
                  id="name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div className="label-form eventInp">
                <label htmlFor="eventCategory">Event Category</label>
                <Multiselect
                  options={existingEventCategory.map((category) => ({
                    key: category._id,
                    value: category.name,
                  }))}
                  displayValue="value"
                  onSelect={onSelect}
                  onRemove={onRemove}
                  selectedValues={existingEventCategory
                    .filter((cat) => eventCategory.includes(cat._id))
                    .map((cat) => ({ key: cat._id, value: cat.name }))}
                />
              </div>

              <div className="label-form eventInp">
                <label htmlFor="startDate">Start Date</label>
                <DatePicker
                  showYearDropdown
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div className="label-form eventInp">
                <label htmlFor="endDate">End Date</label>
                <DatePicker
                  showYearDropdown
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div className="label-form">
                <label htmlFor="eventDetail">Event Detail</label>
                <textarea
                  className="textareaEvent"
                  id="eventDetail"
                  value={eventDetail}
                  onChange={(e) => setEventDetail(e.target.value)}
                />
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageInputChange}
                accept="image/*"
                ref={imageInputRef}
                className="bg-gray-50 border border-gray-300 rounded-md w-full text-gray-900"
              />
              {uploadedImage && (
                <div className="mt-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded Preview"
                    className="w-40 h-40 rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="d-flex">
              <div className="submitEvent addDonarSubmitBtnMain">
                <button
                  className="addDonarSubmitBtn"
                  type="button"
                  onClick={updateEvent}
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
