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
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/expenses/getExpenseById/${BoliLedgerId}`, {
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

    const [formData, setFormData] = useState({
        expenseType: 'expensevoucher',
        narration: '',
        city: '',
        pincode: '',
        state: '',
        country: '',
        mobile: '',
        fullname: '',
        fathersName: '',
        address: '',
        email: '',
        vouchers: [], // Initialize vouchers array
    });


    return (
        <Section>
            {isLoading ? (
                <Spinner />
            ) : donorData ? (
                <>
                    <h2 className="text-center">Expense Information</h2>
                    <div className="flex justify-between">
                        <p className="text-black"><span className="text-gray-500">Ledger Number : </span>{donorData.ledgerNo}</p>
                    </div>

                    <div className="mt-4 mb-8 overflow-x-auto">
                        <table className="min-w-full border text-nowrap border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="w-60 bg-gray-100 border border-gray-300 p-2">Name</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.fullname}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Payment Mode</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.paymentMode}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Amount</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.totalAmount}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Father`s Name</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.fathersName}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Email</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.email}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Address</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.address}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">City</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.city}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">State</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.state}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Country</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.country}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Pincode</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.pincode}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Narration</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.narration}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {donorData.vouchers.length > 0 ?
                        <div className="overflow-x-auto">
                            <h3 className="mb-2">Expense Voucher Details</h3>
                            <div>
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2">Expense Head</th>
                                            <th className="border border-gray-300 p-2">Amount</th>
                                            <th className="border border-gray-300 p-2">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donorData.vouchers.map((donation) => (
                                            <tr key={donation._id}>
                                                <td className="border border-gray-300 p-2">{donation.expenseHead}</td>
                                                <td className="border border-gray-300 p-2">{donation.amount}</td>
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
