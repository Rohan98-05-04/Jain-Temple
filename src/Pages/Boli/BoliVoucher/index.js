import { useState } from "react";
import BoliVoucherModal from "./addBoliVoucher/BoliVoucherModal";
import { useEffect } from "react";
import { API_BASE_URL } from "utils/config";
import Spinner from "src/components/Spinner";
import Section from "@aio/components/Section";
import { AiFillDelete, AiFillEdit, AiOutlineSearch } from "react-icons/ai";
import Pagination from "react-js-pagination";
import Link from "next/link";
import ModalEditBoliVoucher from "./updateBoliVoucher/ModalEditBoliVoucher";
import ModalConfirmDelete from "../ModalConfirmDelete";
import { toast } from "react-toastify";
import ModalViewBoliVoucher from "./viewBoliVoucher/ModalViewBoliVoucher";
import { GrView } from "react-icons/gr";

export default function BoliVoucher() {
    const [donationData, setDonationData] = useState([]);
    const [Data, setData] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [size, setsize] = useState(8);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [Id, setId] = useState();
    const [isModalViewOpen, setModalViewOpen] = useState(false);
    const [isModalDetailOpen, setModalDetailOpen] = useState(false);
    const [paginationData, setPaginationData] = useState(false);

    const openModal = () => setModalOpen(true);
    const openViewModal = () => setModalViewOpen(true);
    const openDetailModal = () => setModalDetailOpen(true);
    const closeModal = () => setModalOpen(false);
    const closeViewModal = () => setModalViewOpen(false);
    const closeDetailModal = () => setModalDetailOpen(false);

    const fetchEvents = async () => {
        const token = localStorage.getItem('token');
        const parseToken = JSON.parse(token) || {};
        setIsLoading(true);

        const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBolis?boliType=${"bolivoucher"}&page=${activePage}&size=${size}&search=${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${parseToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setData(data.data);
            setDonationData(data.data);
            setPaginationData(data.data);
            setIsLoading(false);
        }
        setIsLoading(false);
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

    useEffect(() => {
        fetchEvents();
    }, [activePage, search]);

    const handleRefresh = () => {
        fetchEvents();
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const parseToken = JSON.parse(token) || {};

        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/boliDetail/deleteBoliById/${Id}`, {
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
        <>
            <div className="donarPage">
                {isLoading && <Spinner />}
                <div className="donarDetailMainPage">
                    <Section>
                        <div className="flex flex-col md:flex-row justify-between">
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
                                <button onClick={openModal} className="bg-orange-400 text-white py-2 px-4 rounded-md">Add Boli</button>
                            </div>
                        </div>
                    </Section>

                    <Section>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="w-48 py-4 px-4 text-nowrap border-b">Ledger No.</th>
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
                                            <td className="py-4 px-4 border-b text-nowrap ">{donation.ledgerNumber}</td>
                                            <td className="py-2 px-4 border">{donation.fullName}</td>
                                            <td className="py-2 px-4 border">{donation.email}</td>
                                            <td className="py-2 px-4 border">{donation.mobile}</td>
                                            <td className="py-2 px-4 border">{donation.totalAmount}</td>
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
                                                    <GrView className='text-gray-600 cursor-pointer ml-2' />
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
            </div>
            <BoliVoucherModal isOpen={isModalOpen} onClose={closeModal} onRefresh={handleRefresh}/>
            <ModalEditBoliVoucher isOpen={isModalViewOpen} onClose={closeViewModal} Id={Id}  onRefresh={handleRefresh}/>
            <ModalViewBoliVoucher isOpen={isModalDetailOpen} onClose={closeDetailModal} BoliLedgerId={Id} />
            <ModalConfirmDelete
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                onConfirm={handleDelete}
            />

        </>
    )
}