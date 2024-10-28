import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Pagination from "react-js-pagination";
import Switch from "react-switch";
import Section from '@aio/components/Section';
import { AiFillEdit, AiOutlineSearch } from 'react-icons/ai';
import Spinner from '../../components/Spinner';
import ModalEventAdd from './add-event/ModalAddEvent';
import { API_BASE_URL } from '../../../utils/config';
import ModalEventUpdate from './update-event/ModalUpdateEvent';
import axios from 'axios';

const Event = () => {
  const [TempleData, setTempleData] = useState([]);
  const [Data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(8);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState([]);
  const [eventId, setEventId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSwitchChange = (checked, index) => {
    const updatedIsActive = [...isActive];
    updatedIsActive[index] = checked;
    setIsActive(updatedIsActive);

    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/event/manage-status/${eventId[index]}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,
        },
        body: JSON.stringify({ "status": checked }),
      });

      if (response.ok) {
        await response.json();
      } else {
        console.error(await response.json().errorMessage);
      }
      setIsLoading(false);
    };
    fetchData();
  };

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/event/getallevent?page=${activePage}&size=${size}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setData(data.data);
      setTempleData(data.data.data);
      setIsActive(data.data.data.map(event => event.isActive));
      setEventId(data.data.data.map(event => event._id));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [activePage, search]);

  const handleRefresh = () => {
    fetchEvents();
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const [Id, setId] = useState();
  const [isModalViewOpen, setModalViewOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const openViewModal = () => setModalViewOpen(true);
  const closeModal = () => setModalOpen(false);
  const closeViewModal = () => setModalViewOpen(false);

//   const [translatedText, setTranslatedText] = useState('');
//   const [isTranslating, setIsTranslating] = useState(false);

//   const translateText = async (text, targetLanguage) => {
//     const data = new FormData();
//     data.append('q', text);
//     data.append('target', targetLanguage);
//     data.append('source', 'en');

//     const options = {
//       method: 'POST',
//       url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
//       headers: {
//         'x-rapidapi-key': '1af1a4552amsh2c962a10890b9e0p1b4896jsna3639d290c3b',
//  // Replace with your actual API key
//         'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
//         'Accept-Encoding': 'application/gzip',
//         'Content-Type': 'multipart/form-data',
//       },
//       data: data,
//     };

//     try {
//       setIsTranslating(true);
//       const response = await axios.request(options);
//       const translated = response.data.data.translations[0].translatedText;
//       setTranslatedText(translated);
//     } catch (error) {
//       console.error("Translation error:", error);
//       setTranslatedText("Error in translation.");
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   const handleTranslateToHindi = () => {
//     const textToTranslate = TempleData.map(event => event.eventName).join(' ');
//     console.log("Translating to Hindi:", textToTranslate);
//     translateText(textToTranslate, 'hi');
//   };

//   const handleTranslateToEnglish = () => {
//     const textToTranslate = TempleData.map(event => event.eventName).join(' ');
//     translateText(textToTranslate, 'en');
//   };


  return (
    <div className="p-8">
      {isLoading && <Spinner />}
      <Section>
        <h2 className="text-2xl font-bold mb-4">Events</h2>
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
            <button onClick={openModal} className="bg-orange-400 text-white py-2 px-4 rounded-md">Add Event</button>
          </div>
          {/* <div className="flex space-x-2">
            <button onClick={handleTranslateToHindi} disabled={isTranslating} className="bg-blue-400 text-white py-2 px-4 rounded-md">
              {isTranslating ? 'Translating...' : 'Translate to Hindi'}
            </button>
            <button onClick={handleTranslateToEnglish} disabled={isTranslating} className="bg-green-400 text-white py-2 px-4 rounded-md">
              {isTranslating ? 'Translating...' : 'Translate to English'}
            </button>
          </div> */}
        </div>
      </Section>

      <Section>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-nowrap border">Event Name</th>
                <th className="py-2 px-4 text-nowrap border">Event Detail</th>
                <th className="w-48 py-2 px-4 text-nowrap border-b">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {TempleData.map((Temple, index) => (
                <tr key={Temple._id}>
                  <td className="py-2 px-4 border">{Temple.eventName}</td>
                  <td className="py-2 px-4 border">{Temple.eventDetail}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <button onClick={() => {
                      setId(Temple._id);
                      openViewModal();
                    }}>
                      <AiFillEdit className='text-red-600 cursor-pointer' />
                    </button>
                    <Switch
                      className='ml-4 custom-switch'
                      onChange={(checked) => handleSwitchChange(checked, index)}
                      checked={isActive[index]}
                    />
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

      <ModalEventAdd isOpen={isModalOpen} onClose={closeModal} onRefresh={handleRefresh}/>
      <ModalEventUpdate isOpen={isModalViewOpen} onClose={closeViewModal} eventId={Id} onRefresh={handleRefresh} />
    </div>
  );
};

export default Event;
