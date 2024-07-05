import Link from 'next/link';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect , useState } from 'react';
import { API_BASE_URL } from "../../../utils/config";
import Pagination from "react-js-pagination";
import Section from '@aio/components/Section';
import styles from "./donation.module.css";
import { AiFillEdit } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner'; 
import { jsPDF } from 'jspdf';

// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
// import download from 'downloadjs';



const Donation = () => {
const [donationData, setDonationData] = useState([]);
const [Data, setData] = useState([]);
const [activePage, setActivePage] = useState(1);
const [page, setPage] = useState(1);
const [size, setsize] = useState(8);
const [search, setSearch] = useState('');
const [isActive, setIsActive] = useState([]);
const [donarId, setdonarId] = useState([]);
const [isLoading, setIsLoading] = useState(false);



const handleSearchChange = (event) => {
  setSearch(event.target.value);
};
const  createPdf = () => {
    const doc = new jsPDF();
    doc.text('Hello, PDF!', 10, 10);
    doc.save('sample.pdf');
  };
useEffect(() => {


  const token = localStorage.getItem('token');
          const parseToken = JSON.parse(token) || {};
          setIsLoading(true);
          
          const fetchData = async () => {
            // const response = await fetch(`${API_BASE_URL}/donation/getallDonation`, {
              const response = await fetch(`${API_BASE_URL}/donation/getallDonation?page=${activePage}&size=${size}&search=${search}`, {
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
                setDonationData(data.data.data);
                
                setIsLoading(false);
              } else {
                const data = await response.json();
                console.error(data.errorMessage);
                alert(data.errorMessage);
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
          {/* <button onClick={createPdf}>Create PDF</button> */}

        <div className='donarDetailMainPage'>
          {/* <button onClick={createPdf}>create pdf</button> */}
        <Section>
<div>
  <h2 className={`${styles.formHeaderext}`}>Donations</h2>
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
        </div>
        {/* Add Donar Button */}
       <Link href='/donation/add-donation'> <button className={`btn addDonarBtn ${styles.button}`}>Add Donation</button></Link>
       <Link href='/donation/add-outside-donation'> <button className={`btn  addDonarBtn ${styles.button}`}>Add Outsider Donation</button></Link>

      </div>
      </Section>

     <Section>
     <div className='table-responsive w-100'>

      <table className="table">
      <thead>
        <tr>
          <th scope="col">Payment Type</th>
          <th scope="col">Donation Amount</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
      {donationData.map((donation, index) => (
              <tr key={index}>
                <td>{donation.donationMode}</td>
                <td>{donation.donationAmount}</td>
                <td><Link href={`/donation/${donation._id}`}>
               <AiFillEdit className='red'/></Link>
                    <label>
       
      </label>
                     </td>
              </tr>
            ))}
      </tbody>
    </table>
    </div>
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

export default Donation;
