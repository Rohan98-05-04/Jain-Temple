import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import { ToastContainer, toast } from 'react-toastify';
import Section from "@aio/components/Section";
import styles from "../Website-data/web.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner'; 

export default function AddWebsiteData() {
  const [name, setEventNameCategory] = useState("");
  const [description, setEventDetailCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const router = useRouter();
  const [date, setDate] = useState('');
  const [tithi, setTithi] = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTextChange = (e) => {
    setTithi(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('{ date, text }',{ date, tithi })
    const token = localStorage.getItem("token");
    const parseToken = (token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/tithi/createtithi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify({date, tithi }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Add successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/dashboard");
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
  }



  return (
    <Section>
       {isLoading &&    <Spinner/>  }
    <div className="donarPage w-100">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="addDonarForm">
        <h2 className={`${styles.formHeaderext}`}>Enter Tithi</h2>
        <form onSubmit={handleSubmit}>

      <div className="formMainDiv">
            <div className="label-form eventInp">
              <label htmlFor="name">Date</label>
              <br />
              <input type="date" value={date} onChange={handleDateChange} />
            </div>
           
           
          <div className="label-form textAraeLabel">
              <label htmlFor="description">Tithi</label>
              <br />
              <textarea
              className="textareaEvent"
              value={tithi} onChange={handleTextChange}
              />
            </div>
          </div>
      {/* <button type="submit">Save Text</button> */}
      <div className="d-flex ">
            <div className="submitEvent addDonarSubmitBtnMain">
              <button
                className="addDonarSubmitBtn"
                type="submit"
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
