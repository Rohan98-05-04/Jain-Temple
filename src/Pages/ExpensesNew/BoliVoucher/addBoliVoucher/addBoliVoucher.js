// components/AddBoliForm.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from 'utils/config';

const AddBoliVoucher = () => {
    const [autoData, setAutoData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ledgerNumber, setLedgerNumber] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [voucherType, setvoucherType] = useState('Received');
    const [formData, setFormData] = useState({
        expenseType: 'expensevoucher',
        ledgerName: '',
        narration: '',
        voucherNo: '',
        ledgerNo: ledgerNumber,
        vouchers: [], // Initialize vouchers array
    });

    const paymentOptions = [
        { value: 'cash', label: 'Cash', icon: '💵' },
        { value: 'creditCard', label: 'Credit Card', icon: '💳' },
        { value: 'paypal', label: 'PayPal', icon: '📧' },
        { value: 'bankTransfer', label: 'Bank Transfer', icon: '🏦' },
    ];

    const handlePaymentModeChange = (event) => {
        setPaymentType(event.target.value);
    };


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
            vouchers: [...formData.vouchers, { expenseHead: '', voucherNo: 0, remark: '', amount: '' }],
        });
    };

    const handleRemovePayment = (index) => {
        const updatedDonation = formData.vouchers.filter((_, i) => i !== index);
        setFormData({ ...formData, vouchers: updatedDonation });
    };

    const handlePaymentChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDonation = [...formData.vouchers];
        updatedDonation[index] = { ...updatedDonation[index], [name]: value };
        setFormData({ ...formData, vouchers: updatedDonation });
    };

    const fetchBoliHeads = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBolis?boliType=bolivoucher`);
            const result = await response.json();
            if (response.ok && Array.isArray(result.data?.data)) {
                setDonationTypes(result.data.data);
            } else {
                toast.error('Failed to fetch Expense Heads');
            }
        } catch (error) {
            toast.error('Error fetching Expense Heads: Network error');
            console.error("Error fetching Expense Heads:", error);
        }
    };

    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const donations = formData.vouchers
            .map(payment => ({
                expenseHead: payment.expenseHead || null,
                amount: Number(payment.amount),
                voucherNo: payment.voucherNo || null,
                remark: payment.remark || null,
            }))
        const submissionData = {
            expenseType: 'expensevoucher',
            ledgerName: formData.ledgerName,
            narration: formData.narration,
            voucherNo: formData.voucherNo,
            ledgerNo: ledgerNumber,
            vouchers: donations,
            voucherType,
            paymentMode: paymentType

        };
        const response = await fetch(`${API_BASE_URL}/expenses/createExpense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        if (response.ok) {
            toast.success('Expense Voucher created successfully');
            router.push('/expenses#voucher');
            fetchBoliHeads();
        } else {
            toast.error('Failed to create Expense');
        }
    };

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBolis?boliType=boliledger`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const apiData = data.data.data;
                const matchedData = apiData.filter(item => item.ledgerNumber === ledgerNumber);
                setAutoData(matchedData.length > 0 ? matchedData : []);
            } else {
                const errorData = await response.json();
                alert(errorData.errorMessage);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (ledgerNumber) {
            fetchData();
        }
    }, [ledgerNumber]);

    const [donationTypes, setDonationTypes] = useState();

    const donationItems = [
        { id: 1, itemType_en: "GOLD STOCK DONATION", itemType_hi: "स्वर्ण उपहार दान खाते जमा ", status: 1 },
        { id: 2, itemType_en: "SILVER STOCK DONATION", itemType_hi: "चांदी उपहार दान खाते जमा ", status: 1 },
        { id: 3, itemType_en: "GIFT ITEM DONATION", itemType_hi: "उपहार दान खाते जमा ", status: 1 }
    ];

    useEffect(() => {
        const fetchBoliHeads = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/boliDetail/getAllBoliHeads`);
                const result = await response.json();
                setDonationTypes(result.data);
                console.log(result)
            } catch (error) {
                console.error("Error fetching Expense Heads:", error);
            }
        };

        fetchBoliHeads();
    }, []);

    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // Set the current date in the desired format
        setCurrentDate(new Date().toISOString().split('T')[0]);
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, []);

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className='mb-8'>
                <div className="flex space-x-4 border-gray-300">
                    {['Received', 'cheque', 'electronic', 'item'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setvoucherType(type)}  // Updated to use setPaymentType directly
                            className={`py-2 px-4 rounded-lg transition-colors ${voucherType === type
                                ? 'bg-orange-400 text-white'
                                : 'text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}  {/* Capitalizing the first letter */}
                        </button>
                    ))}
                </div>
            </div>
            <div className='grid md:grid-cols-3 gap-6'>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ledgerNumber">
                        Date
                    </label>
                    <input
                        type="text"
                        value={currentDate}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ledgerNumber">
                        Time
                    </label>
                    <input
                        type="text"
                        value={currentTime}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled
                    />
                </div>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pincode">
                        Voucher No
                    </label>
                    <input
                        type="text"
                        name="voucherNo"
                        value={formData.voucherNo}
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
                        name="ledgerName"
                        value={formData.ledgerName}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupname">
                        Payment Mode
                    </label>
                    <select
                        name="donationItem"
                        value={paymentType}
                        onChange={handlePaymentModeChange}
                        className="border rounded-md p-1 w-full h-14"
                    >
                        <option value="" disabled>Select Donation Item</option>
                        {paymentOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.icon} {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatherName">
                        Narration
                    </label>
                    <input
                        type="text"
                        name="narration"
                        value={formData.narration}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mt-4">Expense Details</h3>
                <table className="w-full border-collapse border border-gray-300 mt-2">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Expense Head</th>
                            <th className="border border-gray-300 p-2">Voucher No.</th>
                            <th className="border border-gray-300 p-2">Amount</th>
                            <th className="border border-gray-300 p-2">Remark</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.vouchers.map((payment, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 p-2">
                                    <select
                                        name="expenseHead"
                                        value={payment.expenseHead || ''}
                                        onChange={(e) => handlePaymentChange(index, e)}
                                        className="border rounded-md p-1 w-full"
                                    >
                                        <option value="" disabled>Select Expense Head Type</option>
                                        {donationItems?.map((type) => (
                                            <option key={type.id} value={type.itemType_hi}>{type.itemType_hi}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        name="voucherNo"
                                        value={payment.voucherNo}
                                        onChange={(e) => handlePaymentChange(index, e)}
                                        className="border rounded-md p-1 w-full"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        name="amount"
                                        value={payment.amount}
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
                Submit
            </button>
        </form>
    );
};

export default AddBoliVoucher;
