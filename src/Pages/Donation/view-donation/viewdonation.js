import Section from "@aio/components/Section";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

export default function ViewDonation({ donationId }) {
    const [donorData, setDonorData] = useState(null);
    const [donationTypes, setDonationTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDonationTypes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/donationDetail/getAllDonationTypes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDonationTypes(data.data.data);
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
                const response = await fetch(`${API_BASE_URL}/donationDetail/getDonationById/${donationId}`, {
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
    }, [donationId]);

    const getDonationTypeName = (id) => {
        const type = donationTypes.find(type => type._id === id);
        return type ? type.nameHindi : "N/A";
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(); // This formats the date based on the user's locale
    };

    return (
        <Section>
            {isLoading ? (
                <Spinner />
            ) : donorData ? (
                <>
                    <h2 className="text-center">Donor Information</h2>
                    <div className="flex justify-between">
                        {donorData.paymentType != "item" ?
                            <p className="text-black"><span className="text-gray-500">Voucher No. : </span>{donorData.voucherNo}</p>
                            :
                            null
                        }
                        <p className="text-black"><span className="text-gray-500">Receipt No. : </span>{donorData.receiptNo}</p>
                    </div>

                    <div className="mt-2 mb-8 overflow-x-auto">
                        <h3 className="mb-2">Donor Details</h3>
                        <table className="min-w-full border text-nowrap border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="w-60 bg-gray-100 border border-gray-300 p-2">Name</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.fullname}</td>
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
                                    <th className="border bg-gray-100 border-gray-300 p-2">Payment Type</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.paymentType}</td>
                                </tr>
                                {donorData.totalAmount ?
                                    <tr>
                                        <th className="border bg-gray-100 border-gray-300 p-2">Total Amount</th>
                                        <td className="border border-gray-300 text-nowrap p-2">{donorData.totalAmount || "N/A"}</td>
                                    </tr>
                                    :
                                    null
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto">
                        <h3 className="mb-2">Donation Details</h3>
                        {donorData && donorData.paymentType === "cheque" && (
                            <div>
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2">Type of Donation</th>
                                            <th className="border border-gray-300 p-2">Amount</th>
                                            <th className="border border-gray-300 p-2">Remark</th>
                                            <th className="border border-gray-300 p-2">Bank Name</th>
                                            <th className="border border-gray-300 p-2">Transaction No.</th>
                                            <th className="border border-gray-300 p-2">Cheque No.</th>
                                            <th className="border border-gray-300 p-2">Cheque Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donorData.donations.map((donation) => (
                                            <tr key={donation._id}>
                                                <td className="border border-gray-300 p-2">{getDonationTypeName(donation.typeofdonation)}</td>
                                                <td className="border border-gray-300 p-2">{donation.amount}</td>
                                                <td className="border border-gray-300 p-2">{donation.remark}</td>
                                                <td className="border border-gray-300 p-2">{donation.bankName || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{donation.transactionNo || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{donation.chequeNo || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{formatDate(donation.chequeDate) || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {donorData && donorData.paymentType === "cash" && (
                            <div>
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2">Type of Donation</th>
                                            <th className="border border-gray-300 p-2">Amount</th>
                                            <th className="border border-gray-300 p-2">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donorData.donations.map((donation) => (
                                            <tr key={donation._id}>
                                                <td className="border border-gray-300 p-2">{getDonationTypeName(donation.typeofdonation)}</td>
                                                <td className="border border-gray-300 p-2">{donation.amount}</td>
                                                <td className="border border-gray-300 p-2">{donation.remark}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {donorData && donorData.paymentType === "electronic" && (
                            <div>
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2">Type of Donation</th>
                                            <th className="border border-gray-300 p-2">Bank Name</th>
                                            <th className="border border-gray-300 p-2">Transaction No.</th>
                                            <th className="border border-gray-300 p-2">Amount</th>
                                            <th className="border border-gray-300 p-2">Remark</th>
                                            {/* Add other relevant fields for electronic donations */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donorData.donations.map((donation) => (
                                            <tr key={donation._id}>
                                                <td className="border border-gray-300 p-2">{getDonationTypeName(donation.typeofdonation)}</td>
                                                <td className="border border-gray-300 p-2">{donation.bankName || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{donation.transactionNo || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{donation.amount}</td>
                                                <td className="border border-gray-300 p-2">{donation.remark}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {donorData && donorData.paymentType === "item" && (
                            <div>
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2">Type of Donation</th>
                                            <th className="border border-gray-300 p-2">Item Type</th>
                                            <th className="border border-gray-300 p-2">Size</th>
                                            <th className="border border-gray-300 p-2">Units</th>
                                            <th className="border border-gray-300 p-2">Quantity</th>
                                            <th className="border border-gray-300 p-2">Amount</th>
                                            <th className="border border-gray-300 p-2">Remark</th>
                                            {/* Add other relevant fields for item donations */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donorData.donations.map((donation) => (
                                            <tr key={donation._id}>
                                                <td className="border border-gray-300 p-2">{donation.donationItem}</td>
                                                <td className="border border-gray-300 p-2">{donation.itemType}</td>
                                                <td className="border border-gray-300 p-2">{donation.size}</td>
                                                <td className="border border-gray-300 p-2">{donation.units || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{donation.quantity || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{donation.amount || 'N/A'}</td>
                                                <td className="border border-gray-300 p-2">{donation.remark || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div>No donation details available.</div>
            )}
        </Section>
    );
}
