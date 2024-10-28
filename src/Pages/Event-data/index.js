import { useEffect, useRef, useState } from "react";

import styles from "./eventdata.module.css";
import { MdOutlinePayment } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { GiProfit } from "react-icons/gi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import Pagination from "react-js-pagination";

import Section from "@aio/components/Section";
import { API_BASE_URL } from "../../../utils/config";
import Spinner from '../../components/Spinner'; 
import 'react-toastify/dist/ReactToastify.css';

import Link from "next/link";

export default function EventData() {
  const [modal, setModal] = useState(false);
  const [dailyEventData, setDailyEventData] = useState([]);
  const [EventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchEvent, setSearchevent] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [activePageevent, setActivePageevent] = useState(1);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(8);
  const [Data, setData] = useState([]);
  const [Dataevent, setDataevent] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = (token) || {};

    const fetchDailyEventData = async () => {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/donation/totalByAllDailyEventCategories?page=${activePage}&size=${size}&search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDailyEventData(data.data.data);
        setData(data.data);
        console.log(data)
        console.log(dailyEventData)
        setIsLoading(false);
        
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchEventData = async () => {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/donation/totalEventCategories?page=${activePageevent}&size=${size}&search=${searchEvent}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEventData(data.data.data);
        setDataevent(data.data);
        console.log(data)
        console.log(EventData)
        setIsLoading(false);
        
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    
   
    fetchDailyEventData();
    fetchEventData();
  }, [activePage,activePageevent,search,searchEvent]);
  const handlePageChange = (pageNumber) => {
    setActivePage( pageNumber);
  }
 
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleEventSearchChange = (event) => {
    setSearchevent(event.target.value);
  };
  return (
    <>
 {isLoading &&    <Spinner/>  }
      

      <Section>
        <h3>Daily event amount</h3>
        <div className={`${styles.addDonarsearchMain} input-group `}>
          <input type="text" className={`${styles.addDonarSearch} form-control  `}
           placeholder="Search"
           onChange={(e) => setSearch(e.target.value)}
            aria-label="Search" />
          <div className="input-group-append">
            <button onClick={handleSearchChange} className={`btn btn-outline-secondary searchBtn ${styles.button}`} type="button">
              Search
            </button>
          </div>
        </div>

      <div className={styles.container}>
      {dailyEventData.map((data,index) => (
        <div  key={index} className={styles.box}>
          <div>
            <p className={styles.boxHead}>{data.name}</p>
            <p className={styles.boxAmount}>{data.totalamount} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <MdOutlinePayment size={30} />
          </div>
        </div>
      ))}
        
      
      </div>
      <div className={styles.pagination}>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={size}
          totalItemsCount={Data?.totalDocuments}
          pageRangeDisplayed={5}
          onChange={handlePageChange.bind(this)}
          itemClass="page-item"
      linkClass="page-link"

        />
      </div>
      </Section>
      <Section>
        <h3>Event amount</h3>
        <div className={`${styles.addDonarsearchMain} input-group `}>
          <input type="text" className={`${styles.addDonarSearch} form-control  `}
           placeholder="Search"
           onChange={(e) => setSearchevent(e.target.value)}
            aria-label="Search" />
          <div className="input-group-append">
            <button onClick={handleEventSearchChange} className={`btn btn-outline-secondary searchBtn ${styles.button}`} type="button">
              Search
            </button>
          </div>
        </div>

      <div className={styles.container}>
      {EventData.map((data, index) => (
        <div  key={index} className={styles.box}>
          <div>
            <p className={styles.boxHead}>{data.name}</p>
            <p className={styles.boxAmount}>{data.totalamount} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <MdOutlinePayment size={30} />
          </div>
        </div>
      ))}
        
      
      </div>
      <div className={styles.pagination}>
        <Pagination
          activePage={activePageevent}
          itemsCountPerPage={size}
          totalItemsCount={Dataevent?.totalDocuments}
          pageRangeDisplayed={5}
          onChange={handlePageChange.bind(this)}
          itemClass="page-item"
      linkClass="page-link"

        />
      </div>
      </Section>
      
    </>
  );
}
