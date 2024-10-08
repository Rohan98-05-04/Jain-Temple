// components/AddBoliForm.js
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from 'utils/config';

const AddBoliGroup = () => {
    const [formData, setFormData] = useState({
        expenseType: 'expensegroup',
        city: '',
        pincode: '',
        state: '',
        country: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/expenses/createExpense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success('Expenses Group created successfully');
            router.push('/expenses#group');
        } else {
            toast.error('Failed to create Expense');
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
                        className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
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

export default AddBoliGroup;
