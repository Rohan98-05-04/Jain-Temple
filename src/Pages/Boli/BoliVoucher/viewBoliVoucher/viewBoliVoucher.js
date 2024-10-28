import Section from "@aio/components/Section";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

export default function ViewBoliVoucher({ BoliLedgerId }) {
    const [donorData, setDonorData] = useState(null);
    const [donationTypes, setDonationTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDonationTypes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBoliHeads`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDonationTypes(data.data.data);
                    console.log("data",donationTypes)
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.errorMessage);
                }
            } catch (error) {
                console.error("Fetch error (donation types):", error);
                toast.error("An error occurred while fetching donation types.");
            }
        };

        fetchDonationTypes();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/boliDetail/getBoliById/${BoliLedgerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDonorData(data.data);
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.errorMessage);
                }
            } catch (error) {
                console.error("Fetch error (donation details):", error); // Log the error
                toast.error("An error occurred while fetching donation details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [BoliLedgerId]);

    const getDonationTypeName = (id) => {
        console.log("Searching for ID:", id); // Log the ID you're searching for
        const type = donationTypes.find(type => type._id === id);
        console.log("Donation type found:", type); // Check what is found
        return type ? type.nameHindi : "N/A";
    };

    return (
        <Section>
            {isLoading ? (
                <Spinner />
            ) : donorData ? (
                <>
                    <h2 className="text-center">Boli Voucher Information</h2>
                    <div className="flex justify-between">
                        <p className="text-black"><span className="text-gray-500">Ledger Number : </span>{donorData.ledgerNumber}</p>
                    </div>

                    <div className="mt-4 mb-8 overflow-x-auto">
                        <table className="min-w-full border text-nowrap border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="w-60 bg-gray-100 border border-gray-300 p-2">Name</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.fullName}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Father Name</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.fatherName}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Mobile</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.mobile}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Address</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.address}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Email</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.email}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Pincode</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.pincode}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">State</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.state}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">City</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.city}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Country</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.country}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {donorData.voucher.length > 0 ?
                        <div className="overflow-x-auto">
                            <h3 className="mb-2">Boli Voucher Details</h3>
                            <div>
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2">Boli Head</th>
                                            <th className="border border-gray-300 p-2">Amount</th>
                                            <th className="border border-gray-300 p-2">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donorData.voucher.map((donation) => (
                                            <tr key={donation._id}>
                                                <td className="border border-gray-300 p-2">{getDonationTypeName(donation.boliHeadtype)}</td>
                                                <td className="border border-gray-300 p-2">{donation.boliAmount}</td>
                                                <td className="border border-gray-300 p-2">{donation.remark}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        : null}
                </>
            ) : (
                <div>No donation details available.</div>
            )}
        </Section>
    );
}
