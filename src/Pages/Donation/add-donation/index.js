import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import Select from "react-select";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import Section from "@aio/components/Section";
import styles from "../donation.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import Table from 'react-bootstrap/Table';

export default function AddDonation() {
  const [donarData, setDonorData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [dailyEventData, setDailyEventData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventCategoryId, setEventCategoryId] = useState(null);
  const [donarId, setDonarId] = useState("");
  const [show, setShow] = useState(false);

  const [eventId, setEventId] = useState(null);
  // const [eventCategoryId, setEvent] = useState("");
  const [donationMode, setDonationMode] = useState("");
  const [donationStatus, setDonationStatus] = useState("");
  const [EventName, setEventName] = useState("");
  const [donationDetail, setDonationDetail] = useState("");
  const [donationAccNumber, setDonationAccNumber] = useState("");
  const [donateToAccNumber, setDonationtoAccNumber] = useState("");
  const [receiptName, setReceiptName] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationDate, setDonationDate] = useState(new Date());
  const [isEventSelected, setIsEventSelected] = useState(false);
  const [isEventCategorySelected, setIsEventCategorySelected] = useState(false);
  const [selectedEventCategoryAmounts, setSelectedEventCategoryAmounts] = useState({}); 
  const [selectedAmounts, setSelectedAmounts] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);
  const [pdfurl, setPdfUrl] = useState('');

  const existingEventCategory = [
    { _id: "option1", name: "Option 1" },
    { _id: "option2", name: "Option 2" },
    { _id: "option3", name: "Option 3" },
  ];
  const donationModeOptions = [
    { value: "Cheque", label: "Cheque" },
    { value: "Online", label: "Online" },
    { value: "Cash", label: "Cash" },
  ];
  const donationStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Complete", label: "Complete" },
  ];
  const [selectedValues, setSelectedValues] = useState([]);
  const [eventCategoryValues, setEventCategoryValues] = useState([]);

  const router = useRouter();
  const [error, setError] = useState("");

  const handleClose = () => {
    setShow(false)
   router.push("/donation");

  };
  const dailyDonationSelected = () => {
    setIsEventSelected(false)
    setIsEventCategorySelected(false)
    setEventId(null)
    setEventCategoryId(null)

  }
  const handleAmountChange = (categoryId, value) => {
    setSelectedAmounts((prevAmounts) => ({
      ...prevAmounts,
      [categoryId]: value,
    }));
  };
  
  const handleEventCategoryAmountChange = (categoryId, value) => {
    setSelectedEventCategoryAmounts((prevAmounts) => ({
      ...prevAmounts,
      [categoryId]: value,
    }));
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/donor/getalldonor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify(),
      });

      if (response.ok) {
        const data = await response.json();
        setDonorData(data.data.data);
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };
    fetchData();
  }, []);
  const [size, setsize] = useState(15);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/event/getallevent?size=${size}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEventData(data.data);
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };
    const fetchDailyEventsData = async () => {
      const response = await fetch(`${API_BASE_URL}/dailyEvent/getAllDailyCategory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDailyEventData(data.data);
        console.log('data',data)
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };

    fetchData();
    fetchDailyEventsData();
  }, []);

  const handleDateChange = (date) => {
    setStartDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setError("");
    } else {
      setError("Invalid date format. Please enter a valid date.");
    }
  };
  const handledonationDate = (date) => {
    setDonationDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setError("");
    } else {
      setError("Invalid date format. Please enter a valid date.");
    }
  };
  const onSelect = (selectedList, selectedItem) => {
    setSelectedValues(selectedList);
  };
  
  const onRemove = (selectedList, removedItem) => {
    setSelectedValues(selectedList);
  };

  const oneventCategorySelect = (selectedList, selectedItem) => {
    setEventCategoryValues(selectedList);
    setIsEventCategorySelected(true)

  };

  const oneventCategoryRemove = (selectedList, removedItem) => {
    setEventCategoryValues(selectedList);
    setIsEventCategorySelected(false)

  };
  const handleEventChange = (selectedOption) => {
    setSelectedEvent(selectedOption);
    if (selectedOption) {
      const event = eventData.data.find(
        (event) => event._id === selectedOption.value._id
      );
      if (event) {
        setEventId(event._id); // Set eventId
        setEventName(event.eventName); // Set EventName (optional)
        setEventCategoryId(null); // Reset event category when event changes
      }
    }
  };
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
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};
    const dailyEvent = [];
    const eventCategory = [];
    if (!isEventSelected) {
      setEventCategoryId(null)
      setEventId(null)
      selectedValues.forEach((category) => {
        dailyEvent.push({
          dailyEventCategory: category.key,
          donateEventAmount: selectedAmounts[category.key] || 0, 
        });
      });
    }
    if (isEventCategorySelected) {
    
      eventCategoryValues.forEach((category) => {
        eventCategory.push({
          eventCategoryId: category.value,
          donateEventAmount: selectedEventCategoryAmounts[category.value] || 0, 
        });
      });
    }
    let calculatedDonationAmount = 0;
    if (!isEventSelected) {
      selectedValues.forEach((category) => {
        calculatedDonationAmount += parseFloat(selectedAmounts[category.key]) || 0;
      });
    }
    else if (isEventCategorySelected) {
      console.log('isEventCategorySelected',isEventCategorySelected)
      eventCategoryValues.forEach((category) => {
        calculatedDonationAmount += parseFloat(selectedEventCategoryAmounts[category.value]) || 0;
      });
      console.log('calculatedDonationAmount',calculatedDonationAmount)
    }
     else {
      calculatedDonationAmount = parseFloat(donationAmount) || 0;
    }
    const inputData = {
      eventId,
      // eventCategory,
      donationMode,
      donationStatus,
      donationDate,
      donationAmount:calculatedDonationAmount,
      donationAccNumber,
      donateToAccNumber,
      receiptName,
      donationDetail,
      dailyEvent
    };
console.log(inputData)
    // Log the input values object
    setIsLoading(true);
    
    const fetchData = async () => {
      const response = await fetch(
        `${API_BASE_URL}/donation/addDonation/${donarId._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parseToken}`,
          },
          body: JSON.stringify(inputData),
        }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('addDonRes',data)
         let donationId = data.data._id
          fetchpdfUrl(donationId)
          toast.success("Add successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // router.push("/donation");
          setIsLoading(false);
        } else {
          const data = await response.json();
          toast.error(data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsLoading(false);
      }
    };
    const fetchpdfUrl = async (donationI) => {
      const response = await fetch(
        `${API_BASE_URL}/donation/downloadPdf/${donationI}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parseToken}`,
          },
          body: JSON.stringify(),
        }
        );
        
        if (response.ok) {
          const data = await response.json();
          const pdfUrl = data.url; // Replace with your PDF URL
          setPdfUrl(pdfUrl)
          setShow(true)
            
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
       {isLoading &&    <Spinner/>  }
    <div className="donarPage">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="addDonarForm">
        <h2 className={`${styles.formHeaderext}`}>Enter donation&apos;s details</h2>
        <form>
            <div className="formMainDiv">
            <div className="label-form eventInp donationDrop">
              <label htmlFor="eventId">Donor</label>
              <br />
              <Select 
              className="selectDropdown"
                options={donarData.map((donor) => ({
                  value: donor._id,
                  label: donor.firstName, // Show donor's first name
                }))}
                name="donorId"
                id="donorId"
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    const selectedDonor = donarData.find(
                      (donor) => donor._id === selectedOption.value
                    );
                    setDonarId(selectedDonor);
                  }
                }}
              />
            </div>
            <div className="label-form donationTypeInput">
            <p className="formLabel">Donation type</p>
            <div className="d-flex">

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                onChange={() => setIsEventSelected(true)}

              />
              <label className="form-check-label" for="flexRadioDefault1">
                Event
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                checked={!isEventSelected}
              // onChange={() => setIsEventSelected(false)}
              onChange={dailyDonationSelected}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Daily donation
              </label>
            </div>
            </div>
            </div>
        
          {!isEventSelected && (
          <div className="label-form eventInp donationDrop">
            <label htmlFor="Event category">Daily events</label>
            <br />
            <Multiselect
            options={dailyEventData.map(category => ({ key: category._id, value: category.name }))}
            placeholder=""
           displayValue="value" // Options to display in the dropdown
           onSelect={onSelect}
           onRemove={onRemove}
         />
       </div>
          )}
            {!isEventSelected && selectedValues.length > 0 && (
                <>
                {selectedValues.map((category) => (
                    <div key={category.key} className="label-form eventInp">
                <div  className=" donationCategoryAmounts">
                  <label htmlFor={`donationAmount_${category.key}`}>
                    Donation Amount for {category.value}
                  </label>
                  <br />
                  <input
                    type="number"
                    id={`donationAmount_${category.key}`}
                    value={selectedAmounts[category.key] || ""}
                    onChange={(e) =>
                      handleAmountChange(category.key, e.target.value)
                    }
                  />
                </div>
                </div>
              ))}
              </>
          )}
          {isEventSelected && (
            <div className="label-form eventInp donationDrop">
              <label htmlFor="eventId">Event</label>
              <br />
              <Select
                options={eventData.data.map((event) => ({
                  value: event,
                  label: event.eventName,
                }))}
                name="eventId"
                id="eventId"
                onChange={handleEventChange}
              />
            </div>
          )}
            {isEventSelected && selectedEvent && selectedEvent?.value?.eventCategory && (
              <div className="label-form eventInp donationDrop">
                <label htmlFor="eventCategoryId">Event category</label>
                <br />
                <Multiselect
                  options={selectedEvent?.value?.eventCategory.map(
                    (category) => ({
                      value: category._id,
                      label: category.name,
                    })
                  )}
                  name="eventCategoryId"
                  displayValue="label"
                  classNamePrefix="Select"
                  id="eventCategoryId"
                  // onChange={(selectedOption) => {
                  //   if (selectedOption) {
                  //     setEventCategoryId(selectedOption.value);
                  //   }
                  // }}
                  onSelect={oneventCategorySelect}
                  onRemove={oneventCategoryRemove}
                />
              </div>
            )}
            {isEventCategorySelected && eventCategoryValues.length > 0 && (
                <>
                {eventCategoryValues.map((category) => (
                    <div key={category.value} className="label-form eventInp">
                <div  className=" donationCategoryAmounts">
                  <label htmlFor={`donationAmount_${category.value}`}>
                    Donation Amount for {category.label}
                  </label>
                  <br />
                  <input
                    type="number"
                    id={`donationAmount_${category.value}`}
                    value={selectedEventCategoryAmounts[category.value] || ""}
                    onChange={(e) =>
                      handleEventCategoryAmountChange(category.value, e.target.value)
                    }
                  />
                </div>
                </div>
              ))}
              </>
          )}
         

            <div className="label-form eventInp donationDrop">
              <label htmlFor="ddonationMode">Payment type</label>
              <br />
              <Select
                options={donationModeOptions}
                name="ddonationMode"
                classNamePrefix="Select"
                id="ddonationMode"
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setDonationMode(selectedOption.value);
                  }
                }}
              />
            </div>
            <div className="label-form eventInp donationDrop">
              <label htmlFor="donationStatus">Donation Status</label>
              <br />
              <Select
                options={donationStatusOptions}
                name="donationStatus"
                classNamePrefix="Select"
                id="donationStatus"
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setDonationStatus(selectedOption.value);
                  }
                }}
              />
            </div>
          
            <div className="label-form eventInp">
              <label htmlFor="donationDate">Donation Date</label>
              <br />
              <DatePicker
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                selected={donationDate}
                onChange={handledonationDate}
                dateFormat="MM/dd/yyyy"
              />
            </div>
            {isEventSelected && (
            <div className="label-form eventInp">
              <label htmlFor="donationAmount">Donation Amount</label>
              <br />
              <input
                type="number"
                id="donationAmount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
            </div>
            )}
          
            <div className="label-form eventInp">
              <label htmlFor="donationAccNumber">Donation Acc Number</label>
              <br />
              <input
                type="text"
                id="donationAccNumber"
                value={donationAccNumber}
                onChange={(e) => setDonationAccNumber(e.target.value)}
              />
            </div>
            <div className="label-form eventInp">
              <label htmlFor="donateToAccNumber">Donation to Acc Number</label>
              <br />
              <input
                type="text"
                id="donateToAccNumber"
                value={donateToAccNumber}
                onChange={(e) => setDonationtoAccNumber(e.target.value)}
              />
            </div>
            <div className="label-form eventInp">
              <label htmlFor="receiptName">Receipt name</label>
              <br />
              <input
                type="text"
                id="receiptName"
                value={receiptName}
                onChange={(e) => setReceiptName(e.target.value)}
              />
            </div>
        
          <div className="label-form ">
            <label htmlFor="donationDetail">Donation Detail</label>
            <br />
            <textarea
              className="textareaEvent"
              type="text"
              id="donationDetail"
              value={donationDetail}
              onChange={(e) => setDonationDetail(e.target.value)}
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
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              Do you want to open pdf?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" >
            <a href={pdfurl} target="_blank" rel="noreferrer">OpenPDf</a>
          </Button>
        </Modal.Footer>
      </Modal>
    </Section>
  );
}
