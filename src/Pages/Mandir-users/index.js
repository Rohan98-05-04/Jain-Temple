import Link from 'next/link';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect , useState } from 'react';
import { API_BASE_URL } from '../../../utils/config';
import Pagination from "react-js-pagination";
import Switch from "react-switch";
import { ToastContainer, toast } from 'react-toastify';
import Section from '@aio/components/Section';
import styles from "./mandir-users.module.css";
import { AiFillEdit } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner'; 


const MandirUsers = () => {
const [donorData, setDonorData] = useState([]);
const [Data, setData] = useState([]);
const [activePage, setActivePage] = useState(1);
const [page, setPage] = useState(1);
const [size, setsize] = useState(8);
const [search, setSearch] = useState('');
const [isActive, setIsActive] = useState([]);
const [donarId, setdonarId] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const handleSwitchChange = (checked, index) => {

  const updatedIs_id = [...donarId];
  const updatedIsActive = [...isActive];
  updatedIsActive[index] = checked;
  setIsActive(updatedIsActive);
  const token = localStorage.getItem('token');
  const parseToken = JSON.parse(token) || {};
  setIsLoading(true);
  
  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/donor/manage-status/${checked}/${updatedIs_id[index]}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
        
      },
      body: JSON.stringify({ "isParent":true}),
    });
    
    if (response.ok) {
      
      const data = await response.json();
      toast.success(data.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsLoading(false);
    } else {
      const data = await response.json();
      toast.error(data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsLoading(false);
    }
  }
  fetchData();
};

const handleSearchChange = (event) => {
  setSearch(event.target.value);
};
useEffect(() => {
  
  const token = localStorage.getItem('token');
  const parseToken = JSON.parse(token) || {};
  setIsLoading(true);
  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/donor/getalldonor?page=${activePage}&size=${size}`, {
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
      console.log('dataMadir',data)
      setDonorData(data.data.data);
      const initialIsActive = data.data.data.map((donor) => donor.isActive);
      setIsActive(initialIsActive);
      const initialdonarId = data.data.data.map((donor) => donor._id);
      setdonarId(initialdonarId);
      setIsLoading(false);
    } else {
      const data = await response.json();
      toast.error(data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
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
          <ToastContainer position="top-right" autoClose={5000} />

        <div className='donarDetailMainPage'>
        <Section>
        <div>
  <h2 className={`${styles.formHeaderext}`}>Mandir users</h2>
</div>
      <div className={`${styles.donationButtons} d-flex justify-content-between mb-3  `} >
        {/* Search Bar */}
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
          {/* <button onClick={notify}>Notify!</button>
        <ToastContainer /> */}
        </div>
        {/* Add Donar Button */}
       <Link href='/mandir-users/add-mandir-users'>  <button className={`btn addDonarBtn ${styles.button}`}>Add mandir user</button></Link>

      </div>
      </Section>
      <Section>

      {/* Bootstrap Table */}
      <div className='table-responsive w-100'>
      <table className='table '>
      <thead>
        <tr>
          <th scope="col">First Name</th>
          {/* <th scope="col">Phone number</th> */}
          <th scope="col">Email</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
      {donorData.map((donor, index) => (
              <tr key={index}>
                <td>{donor.firstName}</td>
                {/* <td>{donor.phoneNumbers[0].Phonenumber1}</td> */}
                <td>{donor.email}</td>
                <td className='d-flex'><Link href={`/mandir-users/${donor._id}`}>
                <AiFillEdit className='red'/></Link>
                    {/* <label> */}
        <Switch  onChange={(checked) => handleSwitchChange(checked, index)}
          checked={isActive[index]} className="custom-switch"
          
          />
           {!donor.user_detail && (
         <Link href={`/mandir-users/view-mandir-user/${donor._id}`}>
         <GrView className='blue'/></Link>
           )}
           {donor.user_detail && (
         <Link href={`/mandir-users/view-mandir-user/${donor.user_detail}`}>
         <GrView className='blue'/></Link>
           )}
      {/* </label> */}
                     </td>
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
          totalItemsCount={Data?.totalDocuments || 0}
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

export default MandirUsers;
