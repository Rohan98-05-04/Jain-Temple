import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../utils/config';
import Pagination from 'react-js-pagination';
import Section from '@aio/components/Section';
import { AiFillEdit, AiOutlineSearch } from 'react-icons/ai';
import Spinner from '../../components/Spinner'; 
import ModalDonation from './add-donation/ModalDonation';

const Donation = () => {
  const [donationData, setDonationData] = useState([]);
  const [Data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [size, setsize] = useState(8);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);
    
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/donation/getallDonation?page=${activePage}&size=${size}&search=${search}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,
        },
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
    };
    
    fetchData();
  }, [activePage, search]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <div className="donarPage">
      {isLoading && <Spinner />}
      <div className="donarDetailMainPage">
        <Section>
          <h2 className="text-2xl font-bold mb-4">Donations</h2>
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

            <Link href='/donation/add-outside-donation'>
                <button className="btn btn-secondary">
                  Add Outsider Donation
                </button>
              </Link>
          </div>
        </Section>

        <Section>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-48 py-2 px-4 text-nowrap border-b">Payment Type</th>
                  <th className="py-2 px-4 border">Donation Amount</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {donationData.map((donation, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{donation.donationMode}</td>
                    <td className="py-2 px-4 border">{donation.donationAmount}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/donation/${donation._id}`}>
                        <AiFillEdit className='text-red-600 cursor-pointer' />
                      </Link>
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
              totalItemsCount={Data?.totalDocuments}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </Section>
      </div>
      <ModalDonation isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Donation;
