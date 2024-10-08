// components/EditBoliForm.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from 'utils/config';

const EditBoliVoucher = ({ id }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [ledgerNumber, setLedgerNumber] = useState('');
    const [formData, setFormData] = useState({
        boliType: 'bolivoucher',
        city: '',
        pincode: '',
        state: '',
        country: '',
        mobile: '',
        fullName: '',
        fatherName: '',
        address: '',
        email: '',
        aadharNo: '',
        openingBalance: '',
        panNo: '',
        voucher: [],
    });

    const handleLedgerNumber = (e) => {
        setLedgerNumber(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddPayment = () => {
        setFormData({
            ...formData,
            voucher: [...formData.voucher, { boliHeadtype: '', boliAmount: '', remark: '' }],
        });
    };

    const handleRemovePayment = (index) => {
        const updatedVoucher = formData.voucher.filter((_, i) => i !== index);
        setFormData({ ...formData, voucher: updatedVoucher });
    };

    const handlePaymentChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVoucher = [...formData.voucher];

        // Parse the amount to a number if the name is 'boliAmount'
        if (name === 'boliAmount') {
            updatedVoucher[index] = { ...updatedVoucher[index], [name]: Number(value) };
        } else {
            updatedVoucher[index] = { ...updatedVoucher[index], [name]: value };
        }

        setFormData({ ...formData, voucher: updatedVoucher });
    };

    const fetchBoliHeads = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBolis?boliType=bolivoucher`);
            const result = await response.json();
            if (response.ok && Array.isArray(result.data?.data)) {
                setDonationTypes(result.data.data);
            } else {
                toast.error('Failed to fetch Boli Heads');
            }
        } catch (error) {
            toast.error('Error fetching Boli Heads: Network error');
            console.error("Error fetching Boli Heads:", error);
        }
    };

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            ledgerNumber: ledgerNumber,
        };

        const response = await fetch(`${API_BASE_URL}/boliDetail/updateBoliById/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData),
        });

        if (response.ok) {
            toast.success('Boli Group updated successfully');
            router.push('/boli#voucher');
            fetchBoliHeads();
        } else {
            toast.error('Failed to update Boli');
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/boliDetail/getBoliById/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(data.data); 
                setLedgerNumber(data.data.ledgerNumber);
            } else {
                const errorData = await response.json();
                console.error(errorData.errorMessage);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const [donationTypes, setDonationTypes] = useState([]);

    useEffect(() => {
        const fetchBoliHeads = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBoliHeads`);
                const result = await response.json();
                setDonationTypes(result.data);
            } catch (error) {
                console.error("Error fetching Boli Heads:", error);
            }
        };

        fetchBoliHeads();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className='grid md:grid-cols-3 gap-6'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ledgerNumber">
                                Ledger Number
                            </label>
                            <input
                                type="text"
                                name="ledgerNumber"
                                value={ledgerNumber}
                                onChange={handleLedgerNumber}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
                                Mobile no.
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherName">
                                Father Name
                            </label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pincode">
                                Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aadharNo">
                                Aadhar no.
                            </label>
                            <input
                                type="text"
                                name="aadharNo"
                                value={formData.aadharNo}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="openingBalance">
                                Opening Balance
                            </label>
                            <input
                                type="number"
                                name="openingBalance"
                                value={formData.openingBalance}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="panNo">
                                PAN No.
                            </label>
                            <input
                                type="text"
                                name="panNo"
                                value={formData.panNo}
                                onChange={handleChange}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mt-4">Boli Details</h3>
                        <table className="w-full border-collapse border border-gray-300 mt-2">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">Boli Head</th>
                                    <th className="border border-gray-300 p-2">Amount</th>
                                    <th className="border border-gray-300 p-2">Remark</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.voucher.map((payment, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2">
                                            <select
                                                name="boliHeadtype"
                                                value={payment.boliHeadtype || ''}
                                                onChange={(e) => handlePaymentChange(index, e)}
                                                className="border rounded-md p-1 w-full"
                                            >
                                                <option value="" disabled>Select Boli Head Type</option>
                                                {donationTypes.map((type) => (
                                                    <option key={type._id} value={type._id}>{type.nameHindi}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="number"
                                                name="boliAmount"
                                                value={payment.boliAmount}
                                                onChange={(e) => handlePaymentChange(index, e)}
                                                className="border rounded-md p-1 w-full"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <input
                                                type="text"
                                                name="remark"
                                                value={payment.remark}
                                                onChange={(e) => handlePaymentChange(index, e)}
                                                className="border rounded-md p-1 w-full"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <button type="button" onClick={() => handleRemovePayment(index)} className="text-red-500">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={handleAddPayment} className="mt-2 p-2 bg-blue-500 text-white rounded">
                            Add Item
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Update
                    </button>
                </>
            )}
        </form>
    );
};

export default EditBoliVoucher;
