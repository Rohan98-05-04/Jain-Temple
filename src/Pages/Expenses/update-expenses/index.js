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
import styles from "../expenses.module.css";
import Section from "@aio/components/Section";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner'; 

export default function UpdateExpenses() {
  const [expensesCategoryId, setExpenseCategory] = useState(null);
  const [expensesStatus, setExpensesStatus] = useState("");
  const [expensesPayemntType, setExpensesPayemntType] = useState("");
  const [expensesName, setExpensesName] = useState("");
  const [expensesDetail, setExpensesDetail] = useState("");
  const [eventCategoryData, setEventCategoryData] = useState([]);

  const [payeeName, setPayeeName] = useState("");
  const [expensesAccNumberFrom, setExpensesAccNumberFrom] = useState("");
  const [expensesAccNumberTo, setExpensesAccNumberTo] = useState("");
  const [expensesAmount, setExpensesAmount] = useState("");
  const [expenseCategoriesData, setExpenseCategoriesData] = useState([]);
  const [expensesDate, setExpensesDate] = useState(new Date());
  const [eventData, setEventData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventCategoryId, setEventCategoryId] = useState(null);
  const [eventExpensesId, setEventId] = useState(null);
  const [EventName, setEventName] = useState("");
  const [expenseCategoryOption, setExpenseCategoryOption] = useState(null);
  const [eventCategoryOption, setEventCategoryOption] = useState(null);
  const [eventExpenseOption, setEventExpenseOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Complete", label: "Complete" },
  ];
  const expenseModeOptions = [
    { value: "Cheque", label: "Cheque" },
    { value: "Online", label: "Online" },
    { value: "Cash", label: "Cash" },
  ];

  const [selectedValues, setSelectedValues] = useState([]);

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
  const handleExpensesDate = (date) => {
    setExpensesDate(date);
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
  const handleExpenseCategoryChange = (selectedOption) => {

    // setSelectedEvent(selectedOption);
    if (selectedOption) {
      setExpenseCategoryOption(selectedOption);
      if (selectedOption.label !== "Event") {
        setEventCategoryId(null);
        setEventId(null);
      }
      const epenseCategory = expenseCategoriesData.find(
        (epenseCategory) => epenseCategory._id === selectedOption.value
      );
      // expenseCategoriesData(epenseCategory.expensesCategory)
      if (epenseCategory) {
        setExpenseCategory(epenseCategory._id);
        // setExpenseCategoryId(epenseCategory.expensesCategory);
      }
    }
  };
  const handleEventCategoryChange = (selectedOption) => {
    setEventCategoryOption(selectedOption);
    setEventCategoryId(selectedOption.value);
  };
  const handleEventChange = (selectedOption) => {

    // setSelectedEvent(selectedOption);
    if (selectedOption) {
      setEventExpenseOption(selectedOption);
      const event = eventData.find(
        (event) => event._id === selectedOption.value
      );
      setEventCategoryData(event.eventCategory);
      if (event) {
        setEventId(event._id);
        setEventName(event.eventName);
      }
    }
  };

  useEffect(() => {
    if (slug.slug) {
      let jsonString = [];
      const token = localStorage.getItem("token");
      const parseToken = JSON.parse(token) || {};
      const fetchData = async () => {
        const response = await fetch(
          `${API_BASE_URL}/expense/getExpense/${slug.slug}`,
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
          jsonString = data.data;

          if (jsonString) {
            const existingObject = jsonString;
            // setExistingData(existingObject);
            setExpensesName(existingObject.expensesName || "");
            setExpenseCategory(existingObject.expensesCategoryId || "");
            setExpensesDetail(existingObject.expensesDetail || "");
            setPayeeName(
              existingObject.payeeName || ""
            );
            setExpensesAccNumberFrom(
              existingObject.expensesAccNumberFrom || ""
            );
            setExpensesAccNumberTo(existingObject.expensesAccNumberTo || "");
            setExpensesAmount(existingObject.expensesAmount || "");
            setExpensesStatus(existingObject.expensesStatus || "");
            setExpensesPayemntType(existingObject.expensesPayemntType || "");
            setEventId(existingObject.eventExpensesId?._id || null);
            setEventCategoryId(existingObject.eventCategoryId?._id || null);
            setExpensesDate(
              existingObject.expensesDate
                ? new Date(existingObject.expensesDate)
                : null
            );

            if (existingObject.expensesCategoryId) {
              setExpenseCategoryOption({
                value: existingObject.expensesCategoryId._id,
                label: existingObject.expensesCategoryId.expensesCategory,
              });
            }
            if (existingObject.eventExpensesId) {
              setEventExpenseOption({
                value: existingObject.eventExpensesId._id,
                label: existingObject.eventExpensesId.eventName,
              });
            }
            if (eventData && eventData.length > 0 && eventExpensesId) {
              const event = eventData.find(
                (event) => event._id === existingObject.eventExpensesId._id
              );
              setEventCategoryData(event.eventCategory);
              if (event) {
                setEventId(event._id);
                setEventName(event.eventName);
              }
            }

            if (existingObject.eventCategoryId) {
              setEventCategoryOption({
                value: existingObject.eventCategoryId._id,
                label: existingObject.eventCategoryId.name,
              });
            }

            //  setDonarOption({
            //   value: existingObject.donarId._id,
            //   label: existingObject.donarId.firstName
            // });
            // setEventOption({
            //   value: existingObject.eventId._id,
            //   label: existingObject.eventId.eventName
            // });
            // if(existingObject.eventCategoryId){

            //   setEventCategoryOption({
            //     value: existingObject.eventCategoryId._id,
            //     label: existingObject.eventCategoryId.name
            //   });
            // }
          }
        } else {
          const data = await response.json();
          console.error(data.errorMessage);
          alert(data.errorMessage);
        }
      };
      fetchData();
    }
  }, [slug, expenseCategoriesData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};

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

    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};

    const fetchData = async () => {
      const response = await fetch(
        `${API_BASE_URL}/expensecat/getallExpCategory`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parseToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExpenseCategoriesData(data.data);
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };

    fetchData();
  }, []);

  const addEvent = () => {
    if (expensesAmount === "" || parseFloat(expensesAmount) < 0) {
      alert("Please enter a valid expenses amount.");
      return;
    }

    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};
    const inputData = {
      expensesCategoryId: expensesCategoryId._id,
      expensesStatus,
      expensesPayemntType,
      expensesName,
      expensesDate,
      eventExpensesId,
      eventCategoryId,
      expensesAmount,
      payeeName,
      expensesAccNumberFrom,
      expensesAccNumberTo,
      expensesDetail,
    };
    setIsLoading(true);
    
    
    // Log the input values object
    const fetchData = async () => {
      const response = await fetch(
        `${API_BASE_URL}/expense/updateExpenses/${slug.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parseToken}`,
          },
          body: JSON.stringify(inputData),
        }
        );
        
        if (response.ok) {
          const data = await response.json();
          toast.success("Update successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          router.push("/expenses");
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
        <h2 className={`${styles.formHeaderext}`}>Update Expense details</h2>
        <form>
        <div className="formMainDiv">

            <div className="label-form eventInp">
              <label htmlFor="expensesName">Expenses Name</label>
              <br />
              <input
                type="text"
                id="expensesName"
                value={expensesName}
                onChange={(e) => setExpensesName(e.target.value)}
              />
            </div>
            <div className="label-form eventInp">
              <label htmlFor="expensesAmount">Expenses Amount</label>
              <br />
              <input
                type="number"
                id="expensesAmount"
                value={expensesAmount}
                onChange={(e) => setExpensesAmount(e.target.value)}
              />
            </div>
            <div className="label-form eventInp donationDrop">
              <label htmlFor="expensesCategoryId">Expense Category</label>
              <br />
              <Select
                options={expenseCategoriesData.map((expenseCategory) => ({
                  value: expenseCategory._id,
                  label: expenseCategory.expensesCategory,
                }))}
                name="expensesCategoryId"
                id="expensesCategoryId"
                onChange={handleExpenseCategoryChange}
                // onChange={(selectedOption) => {
                //   if (selectedOption) {
                //     setExpenseCategory(selectedOption.value);
                //   }
                // }}
                value={expenseCategoryOption}
              />
            </div>
            <div className="label-form eventInp donationDrop">
              <label htmlFor="expensesStatus">Expenses Status</label>
              <br />
              <Select
                options={statusOptions}
                name="expensesStatus"
                classNamePrefix="Select"
                // id="expensesStatus"
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setExpensesStatus(selectedOption.value);
                  }
                }}
                value={{ value: expensesStatus, label: expensesStatus }}
              />
            </div>
            {expenseCategoryOption?.label === "Event" && (
              <div className="label-form eventInp">
                <label htmlFor="eventId">Event</label>
                <br />
                <Select
                  options={eventData.map((event) => ({
                    value: event._id,
                    label: event.eventName,
                  }))}
                  name="eventId"
                  id="eventId"
                  value={eventExpenseOption}
                  onChange={handleEventChange}
                />
              </div>
            )}
            {eventExpenseOption &&
              expenseCategoryOption &&
              expenseCategoryOption?.label === "Event" && (
                <div className="label-form eventInp donationDrop">
                  <label htmlFor="eventCategoryId">Event category</label>
                  <br />
                  <Select
                    options={eventCategoryData.map((event) => ({
                      value: event._id,
                      label: event.name,
                    }))}
                    name="eventCategoryId"
                    classNamePrefix="Select"
                    id="eventCategoryId"
                    //   value={eventCategoryId}
                    value={eventCategoryOption}
                    onChange={handleEventCategoryChange}
                    // onChange={(selectedOption) => {
                    //   if (selectedOption) {
                    //     setEventCategoryId(selectedOption.value);
                    //   }
                    // }}
                  />
                </div>
              )}

            <div className="label-form eventInp">
              <label htmlFor="receiver">
                Receiver
              </label>
              <br />
              <input
                type="text"
                // id="expensesAccNumberFrom"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
              />
            </div>
            <div className="label-form eventInp">
              <label htmlFor="expensesAccNumberFrom">
                Expenses Acc Number From
              </label>
              <br />
              <input
                type="text"
                // id="expensesAccNumberFrom"
                value={expensesAccNumberFrom}
                onChange={(e) => setExpensesAccNumberFrom(e.target.value)}
              />
            </div>
            <div className="label-form eventInp">
              <label htmlFor="expensesAccNumberTo">
                Expenses Acc Number To
              </label>
              <br />
              <input
                type="text"
                // id="expensesAccNumberTo"
                value={expensesAccNumberTo}
                onChange={(e) => setExpensesAccNumberTo(e.target.value)}
              />
            </div>
         
            <div className="label-form eventInp">
              <label htmlFor="expensesDate">Expenses Date</label>
              <br />
              <DatePicker
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                selected={expensesDate}
                onChange={handleExpensesDate}
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className="label-form eventInp donationDrop">
              <label htmlFor="expensesPayemntType">Expenses Status</label>
              <br />
              <Select
                options={expenseModeOptions}
                name="expensesPayemntType"
                classNamePrefix="Select"
                // id="expensesPayemntType"
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setExpensesPayemntType(selectedOption.value);
                  }
                }}
                value={{
                  value: expensesPayemntType,
                  label: expensesPayemntType,
                }}
              />
            </div>
        
          <div className="label-form eventInp">
            <label htmlFor="expensesDetail">Expenses Detail</label>
            <br />
            <textarea
              className="textareaEvent"
              type="text"
              // id="expensesDetail"
              value={expensesDetail}
              onChange={(e) => setExpensesDetail(e.target.value)}
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
          {/* <h2 className="signupText">Already have an account?<Link href='/Sign-in'> Sign In</Link></h2> */}
        </form>
      </div>
    </div>
    </Section>
  );
}
