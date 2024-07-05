import Link from "next/link";
import React from "react";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import Pagination from "react-js-pagination";
import Section from "@aio/components/Section";
import styles from "./committeeMembers.module.css";
import { AiFillEdit } from "react-icons/ai";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner'; 

// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
// import download from 'downloadjs';

const CommitteeMembers = () => {
  const [committeeMembersData, setCommitteeMembersData] = useState([]);
  const [Data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(8);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState([]);
  const [donarId, setdonarId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const createPdf = () => {
    const pdfDoc = PDFDocument.create();
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      // const response = await fetch(`${API_BASE_URL}/donation/getallDonation`, {
      const response = await fetch(
        `${API_BASE_URL}/users/allUser?page=${activePage}&size=${size}&search=${search}`,
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
        setData(data.data);
        setCommitteeMembersData(data.data.data);
        setIsLoading(false);

      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        setIsLoading(false);

      }
    };
    fetchData();
  }, [activePage, search]);
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  return (
    <div className="donarPage">
       {isLoading &&    <Spinner/>  }
      {/* <button onClick={createPdf}>Create PDF</button> */}

      <div className="donarDetailMainPage">
        <Section>
        <div>
  <h2 className={`${styles.formHeaderext}`}>Committee members</h2>
</div>
          <div
            className={`${styles.donationButtons} d-flex justify-content-between mb-3  `}
          >
            {/* Search Bar */}
            <div className={`${styles.addDonarsearchMain} input-group `}>
              <input
                type="text"
                className={`${styles.addDonarSearch} form-control  `}
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search"
              />
              <div className="input-group-append">
                <button
                  onClick={handleSearchChange}
                  className={`btn btn-outline-secondary searchBtn ${styles.button}`}
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
            {/* Add Donar Button */}
            <Link href="/committee-members/add-committee-members">
              {" "}
              <button className={`btn addDonarBtn ${styles.button}`}>
                Add Committee members
              </button>
            </Link>

          </div>
        </Section>

        <Section>
        <div className='table-responsive w-100'>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Number</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {committeeMembersData.map((committee, index) => (
                <tr key={index}>
                  <td>{committee?.name}</td>
                  <td>{committee?.email}</td>
                  <td>{committee?.phonenumber}</td>
                  <td>
                    <Link href={`/committee-members/${committee._id}`}>
                      <AiFillEdit className="red" />
                    </Link>
                    <label></label>
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

export default CommitteeMembers;
