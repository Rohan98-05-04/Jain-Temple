import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import Section from '@aio/components/Section';
import { AiFillEdit, AiOutlineSearch, AiFillDelete } from 'react-icons/ai';
import { API_BASE_URL } from 'utils/config';
import Spinner from 'src/components/Spinner';
import ModalBoliLedger from './addBoliLedger/ModalBoliLedger';
import ModalEditBoliLedger from './updateBoliLedger/ModalUpdateBoliLedger';
import ModalConfirmDelete from '../ModalConfirmDelete';
import { toast } from 'react-toastify';
import { GrView } from 'react-icons/gr';
import ModalViewBoliLedger from './viewBoliLedger/ModalViewBoliLedger';

const BoliLedger = () => {
  const [donationData, setDonationData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(8);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [isModalDetailOpen, setModalDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [Id, setId] = useState();
  const [paginationData, setPaginationData] = useState(false);

  const openModal = () => setModalOpen(true);
  const openViewModal = () => setModalViewOpen(true);
  const openDetailModal = () => setModalDetailOpen(true);
  const closeModal = () => setModalOpen(false);
  const closeViewModal = () => setModalViewOpen(false);
  const closeDetailModal = () => setModalDetailOpen(false);
  const openConfirmDeleteModal = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };
  const closeConfirmDeleteModal = () => setConfirmDeleteOpen(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBolis?boliType=boliledger&page=${activePage}&size=${size}&search=${search}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonationData(data.data);
        setPaginationData(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activePage, search]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const parseToken = JSON.parse(token) || {};

    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/boliDetail/deleteBoliById/${deleteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },
    });

    if (response.ok) {
      toast.success("Record deleted successfully");
      closeConfirmDeleteModal();
    } else {
      const data = await response.json();
      console.error(data.errorMessage);
      alert(data.errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="donarPage">
      {isLoading && <Spinner />}
      <div className="donarDetailMainPage">
        <Section>
          <h2 className="text-2xl font-bold mb-4">Boli Ledger</h2>
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
              <button className="absolute right-0 top-0 text-center text-2xl bg-orange-400 text-white rounded-md px-2 py-2">
                <AiOutlineSearch />
              </button>
            </div>
            {/* Add Donar Button */}
            <div>
              <button onClick={openModal} className="bg-orange-400 text-white py-2 px-4 rounded-md">Add Boli Ledger</button>
            </div>
          </div>
        </Section>

        <Section>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-48 py-2 px-4 text-nowrap border-b">Ledger No.</th>
                  <th className="py-2 px-4 border">Full Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Mobile</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {donationData?.data?.map((donation, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{donation.ledgerNumber}</td>
                    <td className="py-2 px-4 border">{donation.fullName}</td>
                    <td className="py-2 px-4 border">{donation.email}</td>
                    <td className="py-2 px-4 border">{donation.mobile}</td>
                    <td className="py-2 px-4 border">{donation.openingBalance}</td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={() => {
                        setId(donation._id);
                        openViewModal();
                      }}>
                        <AiFillEdit className='text-gray-600 cursor-pointer' />
                      </button>
                      <button onClick={() => {
                        setId(donation._id);
                        openDetailModal();
                      }}>
                        <GrView className='text-red-600 cursor-pointer ml-2' />
                      </button>
                      <button onClick={() => openConfirmDeleteModal(donation._id)}>
                        <AiFillDelete className='text-red-600 cursor-pointer ml-2' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={size}
              totalItemsCount={paginationData?.totalRecords}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </Section>
      </div>
      <ModalBoliLedger isOpen={isModalOpen} onClose={closeModal} />
      <ModalEditBoliLedger isOpen={isModalViewOpen} onClose={closeViewModal} BoliLedgerId={Id} />
      <ModalViewBoliLedger isOpen={isModalDetailOpen} onClose={closeDetailModal} BoliLedgerId={Id} />
      <ModalConfirmDelete 
        isOpen={isConfirmDeleteOpen} 
        onClose={closeConfirmDeleteModal} 
        onConfirm={handleDelete} 
      />
    </div>
  );
};

export default BoliLedger;
