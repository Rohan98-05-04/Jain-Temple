import Link from "next/link";
import React from "react";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../utils/config";
import Pagination from "react-js-pagination";
import Section from "@aio/components/Section";
import styles from "./committeeMembers.module.css";
import { AiFillEdit, AiOutlineSearch } from "react-icons/ai";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner';
import { ToastContainer } from "react-toastify";
import ModalMemberAdd from "./add-committee-members/ModalAddMember";
import ModalMemberUpdate from "./update-committee-members/ModalUpdateMember";

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

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/users/allUser?page=${activePage}&size=${size}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setData(data.data);
      setCommitteeMembersData(data.data.data);
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const [isModalOpen, setModalViewOpen] = useState(false);

  const openModal = () => setModalViewOpen(true);
  const closeModal = () => setModalViewOpen(false);

  const [isModalViewOpen, setModalEditOpen] = useState(false);

  const openEditModal = () => setModalEditOpen(true);
  const closeEditModal = () => setModalEditOpen(false);
  useEffect(() => {
    fetchEvents();
  }, [activePage, search]);

  const handleRefresh = () => {
    fetchEvents();
  };

  const [Id, setId] = useState();

  return (
    <div className="p-4 md:p-8">
      {isLoading && <Spinner />}
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="bg-white p-4">
        <Section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Member</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-3">
            {/* Search Bar */}
            <div className="relative mb-4 md:mb-0">
              <input
                type="text"
                className="border rounded-md px-2 h-10 w-full md:w-64 focus:ring-orange-400"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search"
              />
              <button className="absolute right-0 top-0 text-center  text-2xl  bg-orange-400 text-white rounded-md px-2 py-2">
                <AiOutlineSearch />
              </button>
            </div>
            {/* Add Donar Button */}
            <div>
              <button onClick={openModal} className="bg-orange-400 text-white py-2 px-4 rounded-md">Add Member</button>
            </div>
          </div>
        </Section>
        <Section>
          {/* Bootstrap Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-nowrap border">Name</th>
                  <th className="py-2 px-4 text-nowrap border">Email</th>
                  <th className="py-2 px-4 text-nowrap border">Number</th>
                  <th className="py-2 px-4 text-nowrap border">Action</th>
                </tr>
              </thead>
              <tbody>
                {committeeMembersData.map((committee, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">{committee?.name}</td>
                    <td className="py-2 px-4 border">{committee?.email}</td>
                    <td className="py-2 px-4 border">{committee?.phonenumber}</td>
                    <td className="py-2 px-4 border w-12">
                      <button onClick={() => {
                        setId(committee._id);
                        openEditModal();
                      }}>
                        <AiFillEdit className='text-red-600 cursor-pointer' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        <Section>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={size}
            totalItemsCount={Data?.totalDocuments}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </Section>
        <ModalMemberAdd isOpen={isModalOpen} onClose={closeModal} onRefresh={handleRefresh} />
        <ModalMemberUpdate isOpen={isModalViewOpen} onClose={closeEditModal} eventId={Id} onRefresh={handleRefresh} />
      </div>
    </div>
  );
};

export default CommitteeMembers;
