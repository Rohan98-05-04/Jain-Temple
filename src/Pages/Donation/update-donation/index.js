import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import Select from 'react-select'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import Section from "@aio/components/Section";
import styles from "../donation.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner'; 


export default function UpdateDonation() {
  const [donarData, setDonorData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [dailyEventData, setDailyEventData] = useState([]);

  const [eventCategoryData, setEventCategoryData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventCategoryId, setEventCategoryId] = useState(null);
  const [donarId, setDonarId] = useState("");
  const [templeId, setTempleId] = useState("");

  const [eventId, setEventId] = useState(null);
  // const [eventCategoryId, setEvent] = useState("");
  const [donationMode, setDonationMode] = useState("");
  const [donationStatus, setDonationStatus] = useState("");
  const [EventName, setEventName] = useState("");
  const [donationDetail, setDonationDetail] = useState("");
  const [donationAccNumber, setDonationAccNumber] = useState("");
  const [donateToAccNumber, setDonationtoAccNumber] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donarOption, setDonarOption] = useState(null);
  const [eventOption, setEventOption] = useState(null);
  const [eventCategoryOption, setEventCategoryOption] = useState(null);
  const [modeOption, setModeOption] = useState(null);
  const [statusOption, setStatusOption] = useState(null);
  const [donationDate, setDonationDate] = useState(new Date());
  const [isEventSelected, setIsEventSelected] = useState(false);
  const [selectedAmounts, setSelectedAmounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEventCategorySelected, setIsEventCategorySelected] = useState(false);
  const [selectedEventCategoryAmounts, setSelectedEventCategoryAmounts] = useState({}); 

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];
  // const eventOptions = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ];
  const donationModeOptions = [
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Online', label: 'Online' },
    { value: 'Cash', label: 'Cash' },

  ];
  const donationStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Complete', label: 'Complete' },
  ];
  const [selectedValues, setSelectedValues] = useState([]);

  const router = useRouter();
  const  slug  = router.query;

  const [error, setError] = useState("");

  const dailyDonationSelected = () => {
    setIsEventSelected(false)
    setEventId(null)
    setEventCategoryId(null)

  }
  const eventSelected = () => {
    setIsEventSelected(true)
    // setEventId(null)
    // setEventCategoryId(null)

  }
  const handleAmountChange = (categoryId, value) => {
    setSelectedAmounts((prevAmounts) => ({
      ...prevAmounts,
      [categoryId]: value,
    }));
  };
  
  useEffect(() => {
  
    const token = localStorage.getItem('token');
            const parseToken = (token) || {};
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/donor/getalldonor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,
  
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
      }
      fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = (token) || {};

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/event/getallevent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEventData(data.data.data);
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
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };
    fetchData();
    fetchDailyEventsData();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = (token) || {};

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/event/getAllCategory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // setEventCategoryData(data.data);
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };

    fetchData();
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
  const handleDonarChange = (selectedOption) => {
    if (selectedOption) {
      setDonarOption(selectedOption); // Update the selected donor option
      setDonarId(selectedOption.value); // Update the donor ID
    }
  }; 
   const handleEventCategoryChange = (selectedOption) => {
    setEventCategoryOption(selectedOption)
    setEventCategoryId(selectedOption.value)
   }
    const handleEventChange = (selectedOption) => {
   
    // setSelectedEvent(selectedOption);
    if (selectedOption) {
      setEventOption(selectedOption);
      const event = eventData.find((event) => event._id === selectedOption.value);
  setEventCategoryData(event.eventCategory)
      if (event) {
        setEventId(event._id);
        setEventName(event.eventName);
  
        // Update the event category option based on the selected event's category
        // if (event.eventCategory) {
        //   setEventCategoryOption({
        //     value: event.eventCategory._id,
        //     label: event.eventCategory.name,
        //   });
        //   setEventCategoryId(event.eventCategory._id); // Update eventCategoryId
        // } else {
        //   setEventCategoryOption(null); // Reset event category option if no category
        //   setEventCategoryId(""); // Reset eventCategoryId
        // }
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
  useEffect(() => {
    if (slug.slug) {
    let jsonString = [];
    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
const fetchData = async () => {
const response = await fetch(`${API_BASE_URL}/donation/getdonation/${slug.slug}`, {
method: 'GET',
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${parseToken}`,

},
body: JSON.stringify(),
});

if (response.ok) {
  const data = await response.json();
  console.log('donationData',data.data)
 jsonString = data.data;

 if(jsonString){
   const existingObject = jsonString;
   // setExistingData(existingObject);
   setDonarId(existingObject.donarId._id || '');
   setTempleId(existingObject.templeId._id || '');
   setEventId(existingObject.eventId?._id || null);
   setEventCategoryId(existingObject.eventCategoryId?._id || null);
   setDonationMode(existingObject.donationMode || '');
   setDonationAmount(existingObject.donationAmount || '');
   setDonationStatus(existingObject.donationStatus || '');
 setDonationDetail(existingObject.donationDetail || '');
 setDonationAccNumber(existingObject.donationAccNumber || '');
 setDonationtoAccNumber(existingObject.donateToAccNumber || '');
 setDonationDate(existingObject.donationDate ? new Date(existingObject.donationDate) : null);
 let selectedOption =  {value: existingObject.donarId._id, label: existingObject.donarId.firstName };
 setDonarOption({
  value: existingObject.donarId._id,
  label: existingObject.donarId.firstName
});

setEventOption({
  value: existingObject.eventId?._id,
  label: existingObject.eventId?.eventName
});
if(eventData && eventData.length > 0){
const event = eventData.find((event) => event._id === existingObject.eventId?._id);
  setEventCategoryData(event?.eventCategory)
      if (event) {
        setEventId(event._id);
        setEventName(event.eventName);
      }
    }
    if(existingObject.eventId === null){
      setIsEventSelected(false)
      if (!isEventSelected) {
        setEventCategoryId(null)
        setEventId(null)
        // setSelectedValues(existingObject.dailyEvent);
        let preselectedIds = []
         preselectedIds = existingObject.dailyEvent.map(item => item.dailyEventCategory);

        const preselectedOptions = dailyEventData.filter(option => preselectedIds.includes(option._id));
        const eventCategoryOptions = preselectedOptions.map(item => ({
          key: item._id,
          value: item.name
        }));
        setSelectedValues(eventCategoryOptions);
    
        // selectedValues.forEach((category) => {
        //   dailyEvent.push({
        //     dailyEventCategory: category._id,
        //     donateEventAmount: selectedAmounts[category.key] || 0, 
        //   });
        // });
      }
      const preselectedAmounts = {};
      data.data.dailyEvent.forEach((event) => {
        preselectedAmounts[event.dailyEventCategory] = event.donateEventAmount;
      });

      setSelectedAmounts(preselectedAmounts);
      // let calculatedDonationAmount = 0;
      // if (!isEventSelected) {
      //   selectedValues.forEach((category) => {
      //     calculatedDonationAmount += parseFloat(selectedAmounts[category.key]) || 0;
      //   });
      // } else {
      //   calculatedDonationAmount = parseFloat(donationAmount) || 0;
      // }
    }else{
      
      setIsEventSelected(true)
    }
if (existingObject.eventCategoryId) {
  setEventCategoryOption({
    value: existingObject.eventCategoryId._id,
    label: existingObject.eventCategoryId.name
  });
}
  
 }
} else {
const data = await response.json();
console.error(data.errorMessage);
alert(data.errorMessage);
}
}
fetchData();
    }
  }, [slug,eventData]);

  const addEvent = () => {
 

    const token = localStorage.getItem("token");
    const parseToken = (token) || {};
    const dailyEvent = [];

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
    let calculatedDonationAmount = 0;
    if (!isEventSelected) {
      selectedValues.forEach((category) => {
        calculatedDonationAmount += parseFloat(selectedAmounts[category.key]) || 0;
      });
    } else {
      calculatedDonationAmount = parseFloat(donationAmount) || 0;
    }
    const inputData = {
        eventId,
        donarId,
        templeId,
        eventCategoryId,
        donationMode,
        donationStatus,
        donationDate,
        donationAmount:calculatedDonationAmount,
        donationAccNumber,
        donateToAccNumber,
        donationDetail,
        dailyEvent
      };
    
      // Log the input values object
      setIsLoading(true);
      
      const fetchData = async () => {
        const response = await fetch(`${API_BASE_URL}/donation/updateDonation/${slug.slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parseToken}`,
          },
          body: JSON.stringify(inputData),
        });
        
        if (response.ok) {
          const data = await response.json();
          toast.success('Update successful', {
            position: toast.POSITION.TOP_RIGHT,
          });
          router.push("/donation");
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
       {isLoading &&    <Spinner/>  }
    <div className="donarPage">
               <ToastContainer position="top-right" autoClose={5000} />

      <div className="addDonarForm">
        <h2 className={`${styles.formHeaderext}`}>Update donation&apos;s details</h2>
        <form>
        <div className="formMainDiv">

            <div className="label-form eventInp donationDrop">
            <label htmlFor="donarId">Donar</label>
            <br />
            <Select
          options={donarData.map((donar) => ({
            value: donar._id,
            label: donar.firstName,
          }))}
          isDisabled={true}
          menuPlacement="auto"
          name="donarId"
          id="donarId"
          onChange={handleDonarChange}
          value={donarOption} // Use the value from the state
  // defaultValue={{value: '64d9cc950ddc6168eee8e120', label: 'Ashu'}}
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
                checked={isEventSelected}

                onChange={eventSelected}
                // onChange={() => setIsEventSelected(true)}

              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
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

            {isEventSelected && (
                 <div className="label-form eventInp donationDrop">
            <label htmlFor="eventId">Event</label>
            <br />
            <Select
                options={eventData.map((event) => ({
                  value: event._id,
                  label: event.eventName,
                }))}
                name="eventId"
                id="eventId"
                onChange={handleEventChange}
                value={eventOption}
              />

            
          </div>
            )}
          {isEventSelected && selectedEvent && selectedEvent?.value?.eventCategory || isEventSelected && eventCategoryData && (
  <div className="label-form eventInp donationDrop">
    <label htmlFor="eventCategoryId">Event category</label>
    <br />
    <Multiselect
      // options={selectedEvent?.value.map((category) => ({
      //   value: category._id,
      //   label: category.name,
      // }))}
      options={eventCategoryData.map((event) => ({
        value: event._id,
        label: event.name,
      }))}
      name="eventCategoryId"
      classNamePrefix="Select"
      displayValue="label"
      id="eventCategoryId"
      onChange={ handleEventCategoryChange}
    
      value={eventCategoryOption}
    />
  </div>
)}
          {!isEventSelected && (
          <div className="label-form eventInp donationDrop">
            <label htmlFor="Event category">Daily events</label>
            <br />
            <Multiselect
            options={dailyEventData.map((category) => ({ key: category._id, value: category.name }))}

           placeholder=""
           displayValue="value" // Options to display in the dropdown
           onSelect={onSelect}
           onRemove={onRemove}
           selectedValues={selectedValues}

         />
       </div>
          )}
            {!isEventSelected && selectedValues.length > 0 &&(
              <>
              {selectedValues.map((category) => (
            <div key={category.key} className="label-form eventInp">
                <div  className="label-form eventInp donationCategoryAmounts">
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
            
          <div className="label-form eventInp donationDrop">
            <label htmlFor="donationMode">Payment type</label>
            <br />
            <Select
    options={donationModeOptions}
    name="donationMode"
    classNamePrefix="Select"
    id="donationMode"
    onChange={(selectedOption) => {
      if (selectedOption) {
        setDonationMode(selectedOption.value);
      }
    }}
    value={{ value: donationMode, label: donationMode }} // Preselect the value
  />

            
          </div>
          <div className="label-form eventInp donationDrop">
            <label htmlFor="donationStatus">Donation Status</label>
            <br />
            <Select  options={donationStatusOptions}
            name="donationStatus"
            classNamePrefix="Select"
            id="donationStatus"
            onChange={(selectedOption) => {
                if (selectedOption) {
                  setDonationStatus(selectedOption.value);
                }
              }}         
              value={{ value: donationStatus, label: donationStatus }}   />

            
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
    </Section>
  );
}
