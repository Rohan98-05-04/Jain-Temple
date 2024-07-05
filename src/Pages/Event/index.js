import Link from 'next/link';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect , useState } from 'react';
import { API_BASE_URL } from '../../../utils/config';
import Pagination from "react-js-pagination";
import Switch from "react-switch";
import Section from '@aio/components/Section';
import styles from "./event.module.css";
import { AiFillEdit } from 'react-icons/ai';
import Spinner from '../../components/Spinner'; 

const Event = () => {
const [TempleData, setTempleData] = useState([]);
const [Data, setData] = useState([]);
const [activePage, setActivePage] = useState(1);
const [page, setPage] = useState(1);
const [size, setsize] = useState(8);
const [search, setSearch] = useState('');
const [isActive, setIsActive] = useState([]);
const [eventId, seteventId] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const handleSearchChange = (event) => {
  setSearch(event.target.value);
};

const handleSwitchChange = (checked, index) => {

  const updatedIs_id = [...eventId];
  const updatedIsActive = [...isActive];
  updatedIsActive[index] = checked;
  setIsActive(updatedIsActive);
  const token = localStorage.getItem('token');
  const parseToken = JSON.parse(token) || {};
  setIsLoading(true);
  
  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/event/manage-status/${updatedIs_id[index]}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
        
      },
      body: JSON.stringify({ "status":checked}),
    });
    
    if (response.ok) {
      
      const data = await response.json();
      
      setIsLoading(false);
    } else {
      const data = await response.json();
      console.error(data.errorMessage);
      setIsLoading(false);
    }
    }
    fetchData();
};

useEffect(() => {
  const token = localStorage.getItem('token');
          const parseToken = JSON.parse(token) || {};
          setIsLoading(true);
          
          const fetchData = async () => {
            const response = await fetch(`${API_BASE_URL}/event/getallevent?page=${activePage}&size=${size}&search=${search}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${parseToken}`,
                
              },
              body: JSON.stringify(),
            });
            
            if (response.ok) {
              
              const data = await response.json();
              setData(data.data);
              setTempleData(data.data.data);
              const initialIsActive = data.data.data.map((event) => event.isActive);
              setIsActive(initialIsActive);
              const initialeventId = data.data.data.map((event) => event._id);
              seteventId(initialeventId);
              setIsLoading(false);
            } else {
              const data = await response.json();
              setIsLoading(false);
    }
    }
    fetchData();
}, [activePage,search]);
const handlePageChange = (pageNumber) => {
  setActivePage( pageNumber);
}
  return (
      <div className='donarPage'>
         {isLoading &&    <Spinner/>  }
        <div className='donarDetailMainPage'>
        <Section>
        <div>
  <h2 className={`${styles.formHeaderext}`}>Event</h2>
</div>
      <div className={`${styles.donationButtons} d-flex justify-content-between mb-3  `}>
        <div className={`${styles.addDonarsearchMain} input-group `}>
        <input type="text"  className={`${styles.addDonarSearch} form-control  `}
           placeholder="Search"
           onChange={(e) => setSearch(e.target.value)}
            aria-label="Search" />          <div className="input-group-append">
            <button className={`btn btn-outline-secondary searchBtn ${styles.button}`} type="button">
              Search
            </button>
          </div>
        </div>
       <Link href='/event/add-event'> <button  className={`btn addDonarBtn ${styles.button}`}>Add Event</button></Link>
       <Link href='/event/add-event-category'> <button className={`btn  addDonarBtn ${styles.button}`}>Add Event Category</button></Link>

      </div>
      </Section>
      <Section>
     <div className='table-responsive w-100'>
      <table className='table'>
      <thead>
        <tr>
          <th scope="col">Event Name</th>
          <th scope="col">Event Detail</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
      {TempleData.map((Temple, index) => (
              <tr key={index}>
                <td>{Temple.eventName}</td>
                <td>{Temple.eventDetail}</td>
                <td><Link href={`/event/${Temple._id}`}>
               <AiFillEdit className='red'/></Link>
                  <Switch className='custom-switch' onChange={(checked) => handleSwitchChange(checked, index)}
          checked={isActive[index]}/></td>
              </tr>
            ))}
      </tbody>
    </table>
    </div>
    </Section>
    <Section>

    <div>
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

    </div>
    </div>
  );
};

export default Event;
