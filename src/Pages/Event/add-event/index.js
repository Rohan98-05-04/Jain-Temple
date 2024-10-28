import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import { ToastContainer, toast } from "react-toastify";
import Section from "@aio/components/Section";
import styles from "../event.module.css";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../../components/Spinner";

export default function AddEvent({ onSuccess }) {
  const [eventName, setEventName] = useState("");
  const [image, setImage] = useState(null);
  const [eventDetail, setEventDetail] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [existingEventCategory, setExistingEventCategory] = useState([]);
  const [eventCategory, setEventCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};

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
          const data = await response.json();
          toast.error(data.errorMessage || "Failed to fetch categories.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (err) {
        toast.error("Network error: " + err.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onSelect = (selectedList) => {
    setEventCategory(selectedList.map((item) => item.key)); // Store the selected category keys
  };

  const onRemove = (selectedList) => {
    setEventCategory(selectedList.map((item) => item.key)); // Update categories after removal
  };

  const addEvent = async () => {
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

    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("eventDetail", eventDetail);
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());

      // Send eventCategory as a single JSON string
      formData.append("eventCategory", JSON.stringify(eventCategory));

      if (image) formData.append("image", image);

      const response = await fetch(`${API_BASE_URL}/event/addevent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${parseToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Event added successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        onSuccess();
        router.push("/event");
      } else {
        const data = await response.json();
        toast.error(data.errorMessage || "Failed to add event.", {
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
          <h2 className={styles.formHeaderext}>Enter event&apos;s details</h2>
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
                <label htmlFor="Event category">Event category</label>
                <Multiselect
                  options={existingEventCategory.map((category) => ({
                    key: category._id,
                    value: category.name,
                  }))}
                  displayValue="value"
                  onSelect={onSelect}
                  onRemove={onRemove}
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
              <div>
                <label className="block">
                  Image
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
              </div>
            </div>

            <div className="d-flex">
              <div className="submitEvent addDonarSubmitBtnMain">
                <button
                  className="addDonarSubmitBtn"
                  type="button"
                  onClick={addEvent}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
