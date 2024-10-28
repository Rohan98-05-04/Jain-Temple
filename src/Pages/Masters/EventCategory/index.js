// src/Pages/Masters/BoliHead/index.js

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Pagination from "react-js-pagination";
import { ToastContainer, toast } from 'react-toastify';
import Section from '@aio/components/Section';
import { AiFillEdit } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from 'utils/config';
import { AiOutlineSearch } from "react-icons/ai";
import Spinner from 'src/components/Spinner';
import Cookies from 'js-cookie';
import ModalEventCategory from './addEventCategory/ModalEventCategory';

const EventCategory = () => {
  const [donorData, setDonorData] = useState([]);
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(8);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const token = Cookies.get('token');

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/event/getAllCategory?page=${activePage}&size=${size}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      setData(result.data);
        setDonorData(result.data);
    }
    setIsLoading(false);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  

  const deleteItemById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteBoliById/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any other necessary headers, like Authorization if required
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the item');
      }

      setItems((prevItems) => prevItems.filter(item => item.id !== id));
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Error deleting item: ' + error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activePage, search]);

  const handleRefresh = () => {
    fetchEvents();
  };

  return (
    <div className="">
      {isLoading && <Spinner />}
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="bg-white">
        <Section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Event Category</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-3">
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
            <div>
              <button onClick={openModal} className="bg-orange-400 text-white py-2 px-4 rounded-md">Add Event Category</button>
            </div>
          </div>
        </Section>
        <Section>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-40 px-6 py-3 border text-gray-600">S. No.</th>
                  <th className="px-6 py-3 border text-gray-600">Event Name</th>
                  <th className="px-6 py-3 border text-gray-600">Description</th>
                  <th className="w-40 px-6 py-3 border text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {donorData?.map((donor, index) => (
                  <tr key={donor._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 border">{index + 1}</td>
                    <td className="px-6 py-3 border">{donor.name}</td>
                    <td className="px-6 py-3 border">{donor.description}</td>
                    <td className="px-6 py-3 flex items-center space-x-2">
                      <Link href={`/mandir-users/${donor._id}`}>
                        <AiFillEdit className="text-red-600 hover:text-red-800" />
                      </Link>
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
              totalItemsCount={data.totalRoles || 0}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </Section>
      </div>
      <ModalEventCategory isOpen={isModalOpen} onClose={closeModal} onRefresh={handleRefresh}>
      </ModalEventCategory>
    </div>
  );
};

export default EventCategory;
