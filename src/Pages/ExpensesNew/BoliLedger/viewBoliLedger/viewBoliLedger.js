import Section from "@aio/components/Section";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "src/components/Spinner";
import { API_BASE_URL } from "utils/config";

export default function ViewBoliLedger({ BoliLedgerId }) {
    const [donorData, setDonorData] = useState(null);
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

    return (
        <Section>
            {isLoading ? (
                <Spinner />
            ) : donorData ? (
                <>
                <div>
                <h2 className="text-center">Expense Ledger Information</h2>

                </div>
                    <div className="mt-4 mb-8 overflow-x-auto">
                        <table className="min-w-full border text-nowrap border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Ledger Number</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.ledgerNo}</td>
                                </tr>
                                <tr>
                                    <th className="w-60 bg-gray-100 border border-gray-300 p-2">Name</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.fullname}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Father Name</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.fathersName}</td>
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
                                    <th className="border bg-gray-100 border-gray-300 p-2">PAN No</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.panNo}</td>
                                </tr>
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Aadhar No</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.aadhar}</td>
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
                                <tr>
                                    <th className="border bg-gray-100 border-gray-300 p-2">Opening Balance</th>
                                    <td className="border border-gray-300 text-nowrap p-2">{donorData.openingBalance}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div>No donation details available.</div>
            )}
        </Section>
    );
}
