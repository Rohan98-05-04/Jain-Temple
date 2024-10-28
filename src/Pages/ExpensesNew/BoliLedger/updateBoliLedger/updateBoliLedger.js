import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from 'utils/config';

const EditBoliLedger = ({BoliLedgerId}) => {
    const [formData, setFormData] = useState({
        expenseType: 'expenseledger',
        city: '',
        pincode: '',
        state: '',
        country: '',
        mobile: '',
        fullname: '',
        groupname: '',
        fathersName: '',
        address: '',
        email: '',
        aadhar: '',
        openingBalance: '',
        panNo: '',
    });

    const [donationTypes, setDonationTypes] = useState([]);

    useEffect(() => {
        const fetchBoliHeads = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/expenses/getAllExpenses?expenseType=expensegroup`);
                const result = await response.json();
                if (response.ok && Array.isArray(result.data?.data)) {
                    setDonationTypes(result.data.data);
                } else {
                    toast.error('Failed to fetch Expenses Heads');
                }
            } catch (error) {
                toast.error('Error fetching Expenses Heads: Network error');
                console.error("Error fetching Expenses Heads:", error);
            }
        };

        fetchBoliHeads();
    }, []);

    useEffect(() => {
        const fetchBoliData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/expenses/getExpenseById/${BoliLedgerId}`);
                const result = await response.json();
                if (response.ok) {
                    setFormData(result.data);
                } else {
                    toast.error('Failed to fetch Expenses details');
                }
            } catch (error) {
                toast.error('Error fetching Expenses details: Network error');
                console.error("Error fetching Expenses details:", error);
            }
        };

        fetchBoliData();
    }, [BoliLedgerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // If the group name is changed, set the corresponding data
        if (name === 'groupname') {
            const selectedType = donationTypes.find(type => type._id === value);
            if (selectedType) {
                setFormData(prevData => ({
                    ...prevData,
                    city: selectedType.city,
                    country: selectedType.country,
                    pincode: selectedType.pincode,
                    state: selectedType.state,
                }));
            }
        }
    };

    const fetchBoliHeads = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBolis?boliType=boliledger`);
            const result = await response.json();
            if (response.ok && Array.isArray(result.data?.data)) {
                setDonationTypes(result.data.data);
            } else {
                toast.error('Failed to fetch Expenses Heads');
            }
        } catch (error) {
            toast.error('Error fetching Expenses Heads: Network error');
            console.error("Error fetching Expenses Heads:", error);
        }
    };

    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token');

        try {
            const response = await fetch(`${API_BASE_URL}/expenses/updateExpense/${BoliLedgerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the token here
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Expenses Ledger updated successfully');
                router.push('/expenses#ledger');
                fetchBoliHeads();
            } else {
                toast.error(`Failed to update Expenses`);
            }
        } catch (error) {
            toast.error('Failed to update Expenses: Network error');
            console.error("Error updating Expenses:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className='grid md:grid-cols-3 gap-6'>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupname">
                        Group Name
                    </label>
                    <select
                        name="groupname"
                        value={formData.groupname}
                        onChange={handleChange}
                        className="border rounded-md py-3 px-3 w-full"
                        required
                    >
                        <option value="" disabled>Select Expenses Group Type</option>
                        {donationTypes.map((type) => (
                            <option key={type._id} value={type._id}>{type.city}</option>
                        ))}
                    </select>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fathersName">
                        Father Name
                    </label>
                    <input
                        type="text"
                        name="fathersName"
                        value={formData.fathersName}
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
                        type="email"
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aadhar">
                        Aadhar no.
                    </label>
                    <input
                        type="text"
                        name="aadhar"
                        value={formData.aadhar}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="panNo">
                        PAN no.
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="openingBalance">
                        Opening Balance
                    </label>
                    <input
                        type="text"
                        name="openingBalance"
                        value={formData.openingBalance}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Update
            </button>
        </form>
    );
};

export default EditBoliLedger;

