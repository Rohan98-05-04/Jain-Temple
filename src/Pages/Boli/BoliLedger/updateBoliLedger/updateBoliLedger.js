import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from 'utils/config';

const EditBoliLedger = ({BoliLedgerId}) => {
    const [formData, setFormData] = useState({
        boliType: 'boliledger',
        city: '',
        pincode: '',
        state: '',
        country: '',
        mobile: '',
        fullName: '',
        groupName: '',
        fatherName: '',
        address: '',
        email: '',
        aadharNo: '',
        openingBalance: '',
        panNo: '',
    });

    const [donationTypes, setDonationTypes] = useState([]);

    useEffect(() => {
        const fetchBoliHeads = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBolis?boliType=boligroup`);
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

        fetchBoliHeads();
    }, []);

    useEffect(() => {
        const fetchBoliData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/boliDetail/getBoliById/${BoliLedgerId}`);
                const result = await response.json();
                if (response.ok) {
                    setFormData(result.data);
                } else {
                    toast.error('Failed to fetch Boli details');
                }
            } catch (error) {
                toast.error('Error fetching Boli details: Network error');
                console.error("Error fetching Boli details:", error);
            }
        };

        fetchBoliData();
    }, [BoliLedgerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // If the group name is changed, set the corresponding data
        if (name === 'groupName') {
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
        const token = Cookies.get('token');

        try {
            const response = await fetch(`${API_BASE_URL}/boliDetail/updateBoliById/${BoliLedgerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the token here
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Boli Group updated successfully');
                router.push('/boli#ledger');
                fetchBoliHeads();
            } else {
                toast.error(`Failed to update Boli`);
            }
        } catch (error) {
            toast.error('Failed to update Boli: Network error');
            console.error("Error updating Boli:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className='grid md:grid-cols-3 gap-6'>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupName">
                        Group Name
                    </label>
                    <select
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleChange}
                        className="border rounded-md py-3 px-3 w-full"
                        required
                    >
                        <option value="" disabled>Select Boli Head Type</option>
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

