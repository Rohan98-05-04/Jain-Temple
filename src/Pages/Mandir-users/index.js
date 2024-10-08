import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Pagination from "react-js-pagination";
import Switch from "react-switch";
import { ToastContainer, toast } from 'react-toastify';
import Section from '@aio/components/Section';
import { AiFillEdit } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner';
import { API_BASE_URL } from 'utils/config';
import { AiOutlineSearch } from "react-icons/ai";
import Modal from './add-mandir-users/Modal';
import ModalViewDonor from './view-mandir-users/ModalViewDonor';
import ModalEditDonor from './update-mandir-users/ModalEditDonor';

const MandirUsers = () => {
  const [donorData, setDonorData] = useState([]);
  const [Data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(8);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState([]);
  const [donarId, setDonarId] = useState([]);
  const [Id, setId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);



  const [isModalViewOpen, setModalViewOpen] = useState(false);

  const openViewModal = () => setModalViewOpen(true);
  const closeViewModal = () => setModalViewOpen(false);

  const [isModalEditOpen, setModalEditOpen] = useState(false);

  const openEditModal = () => setModalEditOpen(true);
  const closeEditModal = () => setModalEditOpen(false);

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
        body: JSON.stringify({ "isParent": true }),
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/donor/getalldonor?page=${activePage}&size=${size}&search=${search}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data.data);
        setDonorData(data.data.data);
        const initialIsActive = data.data.data.map((donor) => donor.isActive);
        setIsActive(initialIsActive);
        const initialDonarId = data.data.data.map((donor) => donor._id);
        setDonarId(initialDonarId);
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
  }, [activePage, search]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  }
  console.log(Id)

  return (
    <div className="p-4 md:p-8">
      {isLoading && <Spinner />}
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="bg-white p-4">
        <Section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Mandir users</h2>
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
              <button onClick={openModal} className="bg-orange-400 text-white py-2 px-4 rounded-md">Add mandir user</button>
            </div>
          </div>
        </Section>
        <Section>
          {/* Bootstrap Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-40 px-6 py-3 border text-gray-600">First Name</th>
                  <th className="w-40 px-6 py-3 border text-gray-600">Contact No.</th>
                  <th className="px-6 py-3 border text-gray-600">Email</th>
                  <th className="w-40 px-6 py-3 border text-gray-600">Status</th>
                  <th className="w-40 px-6 py-3 border text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {donorData.map((donor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 border">{donor.firstName}</td>
                    <td className="px-6 py-3 border">
                      {/* Display the phone number */}
                      {donor.phoneNumbers?.length > 0 ? (
                        donor.phoneNumbers.map((phone, idx) => (
                          <div key={idx}>{phone.Phonenumber1}</div>
                        ))
                      ) : (
                        <div>No phone number available</div>
                      )}
                    </td>
                    <td className="px-6 py-3 border">{donor.email}</td>
                    <td className="px-6 py-3 border">
                      {/* Display isActive status */}
                      {donor.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Deactivated</span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex items-center space-x-2">
                      <button onClick={() => {
                        setId(donor._id);
                        openEditModal();
                      }}>
                        <AiFillEdit className="text-red-600 hover:text-red-800" />
                      </button>
                      <Switch
                        onChange={(checked) => handleSwitchChange(checked, index)}
                        checked={isActive[index]}
                        className="custom-switch"
                      />
                      <button onClick={() => {
                        setId(donor.user_detail || donor._id);
                        openViewModal();
                      }}>
                        <GrView className='text-gray-600 cursor-pointer ml-2' />
                      </button>
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
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </Section>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
      </Modal>
      <ModalViewDonor isOpen={isModalViewOpen} onClose={closeViewModal} DonorId={Id} />
      <ModalEditDonor isOpen={isModalEditOpen} onClose={closeEditModal} DonorId={Id} />
    </div>
  );
};

export default MandirUsers;
