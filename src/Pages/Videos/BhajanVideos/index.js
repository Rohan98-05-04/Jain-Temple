import Link from "next/link";
import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import Section from "@aio/components/Section";
import { AiFillDelete, AiFillEdit, AiOutlineSearch } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { API_BASE_URL, WEB_BASE_URL } from "utils/config";
import Spinner from "src/components/Spinner";
import ModalVideo from "./AddLiveVideos/ModalAddLiveVideo";
import ModalUpdateLink from "./UpdateLiveVideos/ModalUpdateLiveVideo";
import ModalConfirmDelete from "./ModalDeleteVideo";
import { toast } from "react-toastify";

const BhajanVideos = () => {
  const [donationData, setDonationData] = useState([]);
  const [Id, setId] = useState();
  const [Data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [size, setsize] = useState(8);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [paginationData, setPaginationData] = useState(false);

  const openModal = () => setModalOpen(true);
  const openViewModal = () => setModalViewOpen(true);
  const closeModal = () => setModalOpen(false);
  const closeViewModal = () => setModalViewOpen(false);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    const parseToken = token || {};
    setIsLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/bhashan/getAllBhashans?page=${activePage}&size=${size}&search=${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setData(data.data);
      setDonationData(data.data);
      setPaginationData(data.data.pagination);
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

  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const openConfirmDeleteModal = (id) => {
    setId(id);
    setConfirmDeleteOpen(true);
  };
  const closeConfirmDeleteModal = () => setConfirmDeleteOpen(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const parseToken = token || {};

    setIsLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/bhashan/deleteBhashan/${Id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      }
    );

    if (response.ok) {
      toast.success("Record deleted successfully");
      handleRefresh();
      closeConfirmDeleteModal();
    } else {
      const data = await response.json();
      console.error(data.errorMessage);
      closeConfirmDeleteModal();
    }
    setIsLoading(false);
  };

  return (
    <div className="donarPage ">
      {isLoading && <Spinner />}
      <div className="donarDetailMainPage">
        <Section>
          <h2 className="text-2xl font-bold mb-4">Bhajan Videos</h2>
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
              <button
                onClick={openModal}
                className="bg-orange-400 text-white py-2 px-4 rounded-md"
              >
                Add Bhajan
              </button>
            </div>
          </div>
        </Section>

        <Section>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-32 py-2 px-4 text-nowrap border-b text-center">
                    S. No.
                  </th>
                  <th className="py-2 px-4 border">Video Links</th>
                  <th className="py-2 px-4 border">Image</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {donationData?.map((donation, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border">
                      {donation.videoLink ? (
                        <Link
                          href={donation.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {donation.videoLink}
                        </Link>
                      ) : (
                        <span>No video link available</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border w-40 ">
                      <img src={WEB_BASE_URL + "/" + donation.image} />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => {
                          setId(donation._id);
                          openViewModal();
                        }}
                      >
                        <AiFillEdit className="text-gray-600 cursor-pointer" />
                      </button>
                      <button
                        onClick={() => openConfirmDeleteModal(donation._id)}
                      >
                        <AiFillDelete className="text-red-600 cursor-pointer ml-2" />
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
              totalItemsCount={paginationData?.total}
              pageRangeDisplayed={paginationData?.limit}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </Section>
      </div>
      <ModalVideo
        isOpen={isModalOpen}
        onClose={closeModal}
        onRefresh={handleRefresh}
      />
      <ModalUpdateLink
        isOpen={isModalViewOpen}
        onClose={closeViewModal}
        Id={Id}
        onRefresh={handleRefresh}
      />
      <ModalConfirmDelete
        isOpen={isConfirmDeleteOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDelete}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default BhajanVideos;
