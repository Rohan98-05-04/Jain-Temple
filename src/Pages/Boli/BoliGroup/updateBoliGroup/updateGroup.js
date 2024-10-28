import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from 'utils/config';

const EditBoliGroup = ({ boliId }) => {
    const [formData, setFormData] = useState({
        boliType: 'boligroup',
        city: '',
        pincode: '',
        state: '',
        country: ''
    });
    

    // Fetch Boli details if a boliId is provided
    useEffect(() => {
        const fetchBoliDetails = async () => {
            if (boliId) {
                const response = await fetch(`${API_BASE_URL}/boliDetail/getBoliById/${boliId}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data.data);
                } else {
                    toast.error('Failed to fetch Boli details');
                }
            }
        };

        fetchBoliDetails();
    }, [boliId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiEndpoint = boliId
            ? `${API_BASE_URL}/boliDetail/updateBoliById/${boliId}`
            : `${API_BASE_URL}/boliDetail/createBoli`;
        
        const method = boliId ? 'PUT' : 'POST';

        const response = await fetch(apiEndpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success(`Boli Group ${boliId ? 'updated' : 'created'} successfully`);
            router.push('/boli#group');
            fetchBoliHeads();
        } else {
            toast.error('Failed to save Boli');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className='grid md:grid-cols-3 gap-6'>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
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
            </div>
            <div className="mb-4 grid md:grid-cols-3">
                <div>
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
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Submit
            </button>
        </form>
    );
};

export default EditBoliGroup;
