import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import { ToastContainer, toast } from 'react-toastify';
import Section from "@aio/components/Section";
import styles from "../event.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner';

export default function UpdateEvent({ eventId, onSuccess }) {
  const [eventName, setEventName] = useState("");
  const [eventDetail, setEventDetail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [existingEventCategory, setexistingEventCategory] = useState([]);
  const [SelectedOption, setSelectedOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const options = [
    { key: "option1", value: "Option 1" },
    { key: "option2", value: "Option 2" },
    { key: "option3", value: "Option 3" },
  ];
  const [eventCategory, setEventCategory] = useState([]);

  const router = useRouter();
  const slug = router.query;

  const [error, setError] = useState("");

  const handleDateChange = (date) => {
    setStartDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setError("");
    } else {
      setError("Invalid date format. Please enter a valid date.");
    }
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setError("");
    } else {
      setError("Invalid date format. Please enter a valid date.");
    }
  };
  const onSelect = (selectedList) => {
    const selectedIds = selectedList.map(item => item.key);
    setEventCategory(selectedIds);
  };

  const onRemove = (selectedList) => {
    const selectedIds = selectedList.map(item => item.key);
    setEventCategory(selectedIds);
  };
  useEffect(() => {
    if (eventId) {
      let jsonString = [];
      const token = localStorage.getItem('token');
      const parseToken = (token) || {};
      const fetchData = async () => {
        const response = await fetch(`${API_BASE_URL}/event/getevent/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${parseToken}`,

          },
          body: JSON.stringify(),
        });

        if (response.ok) {

          const data = await response.json();
          jsonString = data.data;

          if (jsonString) {
            const existingObject = jsonString;
            // setExistingData(existingObject);
            setEventName(existingObject.eventName || '');
            setEventDetail(existingObject.eventDetail || '');
            setStartDate(existingObject.startDate ? new Date(existingObject.startDate) : null);
            setEndDate(existingObject.endDate ? new Date(existingObject.endDate) : null);
            const selectedOption = existingObject.eventCategory.map(item => {
              return { key: item._id, value: item.name };
            });
            setSelectedOption(selectedOption);
            setEventCategory(existingObject.eventCategory.map(item => item._id));

          }
        } else {
          const data = await response.json();
          console.error(data.errorMessage);
          alert(data.errorMessage);
        }
      }
      fetchData();
    }
  }, [eventId]);
  useEffect(() => {

    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/event/getAllCategory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,

        },
        body: JSON.stringify(),
      });

      if (response.ok) {

        const data = await response.json();
        setexistingEventCategory(data.data)

      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    }
    fetchData();
  }, []);

  const customYearDropdown = ({ year, onChange }) => {
    const yearOptions = [];
    const startYear = year - 20; // Show 20 years before the selected year

    for (let i = 0; i < 40; i++) {
      // Show 40 years in the dropdown (20 years before and after the selected year)
      yearOptions.push(
        <option key={startYear + i} value={startYear + i}>
          {startYear + i}
        </option>
      );
    }
  };

  const addEvent = () => {
    if (eventName.trim() === "" || eventDetail.trim() === "") {
      alert("Please fill required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const parseToken = (token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/event/updateevent/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify({ eventName, eventDetail, startDate, endDate, eventCategory }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Update successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        onSuccess();
        router.push("/event");
        setIsLoading(false);
      } else {
        const data = await response.json();
        toast.error(data.errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false);
      }
    };
    fetchData();
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <div className="donarPage">
        <ToastContainer position="top-right" autoClose={5000} />

        <div className="addDonarForm">
          <h2 className={`${styles.formHeaderext}`}>Update event&apos;s details</h2>
          <form>
            <div className="formMainDiv">

              <div className="label-form eventInp">
                <label htmlFor="name">Event Name</label>
                <br />
                <input
                  type="text"
                  id="name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div className="label-form eventInp">
                <label htmlFor="Event category">Event category</label>
                <br />
                <Multiselect
                  options={existingEventCategory.map(category => ({ key: category._id, value: category.name }))}
                  selectedValues={SelectedOption}
                  // selectedValues={eventCategory.map(id => ({ key: id, value: '' }))} 
                  placeholder=""

                  displayValue="value"
                  onSelect={onSelect}
                  onRemove={onRemove}
                />
              </div>


              <div className="label-form eventInp">
                <label htmlFor="startDate">Start Date</label>
                <br />
                <DatePicker
                  showYearDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  selected={startDate}
                  onChange={handleDateChange}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div className="label-form eventInp">
                <label htmlFor="endDate">End Date</label>
                <br />
                <DatePicker
                  showYearDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  selected={endDate}
                  onChange={handleEndDateChange}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div className="label-form ">
                <label htmlFor="eventDetail">Event Detail</label>
                <br />
                <textarea
                  className="textareaEvent"
                  type="text"
                  id="eventDetail"
                  value={eventDetail}
                  onChange={(e) => setEventDetail(e.target.value)}
                />
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
              <div className="nextDonarSubmitBtnMain"></div>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
