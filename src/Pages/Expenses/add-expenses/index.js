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
import styles from "../expenses.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner'; 

export default function AddExpenses() {
  const [expensesCategoryId, setExpenseCategory] = useState(null);
  const [expensesStatus, setExpensesStatus] = useState("");
  const [expensesPayemntType, setExpensesPayemntType] = useState("");
  const [expensesName, setExpensesName] = useState("");
  const [expensesDetail, setExpensesDetail] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [expensesAccNumberFrom, setExpensesAccNumberFrom] = useState("");
  const [expensesAccNumberTo, setExpensesAccNumberTo] = useState("");
  const [expensesAmount, setExpensesAmount] = useState("");
  const [expenseCategoriesData, setExpenseCategoriesData] = useState([]);
  const [expensesDate, setexpensesDate] = useState(new Date());
  const [eventData, setEventData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventCategoryId, setEventCategoryId] = useState(null);
  const [eventExpensesId, setEventId] = useState(null);
  const [EventName, setEventName] = useState("");
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
  const [error, setError] = useState("");

  const handleDateChange = (date) => {
    setStartDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setError("");
    } else {
      setError("Invalid date format. Please enter a valid date.");
    }
  };
  const handleexpensesDate = (date) => {
    setexpensesDate(date);
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

  const handleExpenseCategory = (selectedOption) => {
    setExpenseCategory(selectedOption.value);
    setEventCategoryId(null);
    setEventId(null);
  };
  const handleEventChange = (selectedOption) => {
    setSelectedEvent(selectedOption);
    if (selectedOption) {
      const event = eventData.find(
        (event) => event._id === selectedOption.value._id
      );
      if (event) {
        setEventId(event._id); // Set eventId
        setEventName(event.eventName); // Set EventName (optional)
        setEventCategoryId(null); // Reset event category when event changes
      }
    }
  };

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

    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = (token) || {};

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
    const parseToken = (token) || {};
    const inputData = {
      expensesCategoryId,
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

    // Log the input values object
    setIsLoading(true);
    
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/expense/addexpenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify(inputData),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success("Add successfully", {
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
          <h2 className={`${styles.formHeaderext}`}>Enter Expense details</h2>
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
                  onChange={handleExpenseCategory}
                  // onChange={(selectedOption) => {
                  //   if (selectedOption) {
                  //     setExpenseCategory(selectedOption.value);
                  //   }
                  // }}
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
                />
              </div>

              {expensesCategoryId &&
                expenseCategoriesData.some(
                  (category) =>
                    category._id === expensesCategoryId &&
                    category.expensesCategory == "Event"
                ) && (
                  <div className="label-form eventInp">
                    <label htmlFor="eventId">Event</label>
                    <br />
                    <Select
                      options={eventData.map((event) => ({
                        value: event,
                        label: event.eventName,
                      }))}
                      name="eventId"
                      id="eventId"
                      onChange={handleEventChange}
                    />
                  </div>
                )}
              {expensesCategoryId &&
                expenseCategoriesData.some(
                  (category) =>
                    category._id === expensesCategoryId &&
                    category.expensesCategory == "Event"
                ) &&
                selectedEvent &&
                selectedEvent?.value?.eventCategory && (
                  <div className="label-form eventInp donationDrop">
                    <label htmlFor="eventCategoryId">Event category</label>
                    <br />
                    <Select
                      options={selectedEvent?.value?.eventCategory.map(
                        (category) => ({
                          value: category._id,
                          label: category.name,
                        })
                      )}
                      name="eventCategoryId"
                      classNamePrefix="Select"
                      id="eventCategoryId"
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setEventCategoryId(selectedOption.value);
                        }
                      }}
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
                  onChange={handleexpensesDate}
                  dateFormat="MM/dd/yyyy"
                />
              </div>

              <div className="label-form eventInp donationDrop">
                <label htmlFor="expensesPayemntType">Payment type</label>
                <br />
                <Select
                  options={expenseModeOptions}
                  name="expensesPayemntType"
                  classNamePrefix="Select"
                  // id="expensesStatus"
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setExpensesPayemntType(selectedOption.value);
                    }
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
