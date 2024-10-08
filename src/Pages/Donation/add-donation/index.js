import Section from '@aio/components/Section';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'src/components/Spinner';
import { API_BASE_URL } from 'utils/config';
import { FaPlusSquare } from "react-icons/fa";

const AddDonation = () => {
  const [paymentType, setPaymentType] = useState('cash');
  const [formData, setFormData] = useState({
    fullname: '',
    mobile: '',
    address: '',
    remark: '',
    donation: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [donationTypes, setDonationTypes] = useState([]);

  useEffect(() => {
    const fetchDonationTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/donationDetail/getAllDonationTypes`);
        const data = await response.json();
        setDonationTypes(data.data.data);
        console.log(donationTypes)
      } catch (error) {
        console.error('Error fetching donation types:', error);
      }
    };

    fetchDonationTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e);
    setFormData((prev) => ({
      ...prev,
      donation: [],
    }));
  };

  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const newPayments = [...formData.donation];

    newPayments[index] = {
      ...newPayments[index],
      [name]: value // This should store the ID correctly
    };

    setFormData({ ...formData, donation: newPayments });

    // Optionally update total amount
    const totalAmount = newPayments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
    setFormData((prev) => ({ ...prev, amount: totalAmount }));
  };


  const handleRemovePayment = (index) => {
    const newPayments = formData.donation.filter((_, i) => i !== index);
    setFormData({ ...formData, donation: newPayments });
  };

  const handleAddPayment = () => {
    setFormData((prev) => ({
      ...prev,
      donation: [...prev.donation, { bankName: '', transactionNo: '', chequeNo: '', chequeDate: '', cardNumber: '', expiryDate: '', typeOfDonation: '', amount: 0, remark: '', donationItem: '', size: '', units: '', itemType: '', quantity: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const donations = formData.donation
        .map(payment => ({
          typeofdonation: payment.typeOfDonation || null,
          amount: Number(payment.amount),
          remark: payment.remark || null,
          bankName: payment.bankName || null,
          transactionNo: payment.transactionNo || null,
          chequeNo: payment.chequeNo || null,
          chequeDate: payment.chequeDate || null,
          donationItem: payment.donationItem || null,
          size: payment.size || null,
          units: payment.units || null,
          itemType: payment.itemType || null,
          quantity: payment.quantity || null
        }))
        .filter(donation => donation.amount > 0); // Ensure amount is greater than 
      console.log(donations)
      if (donations.length === 0) {
        toast.error('Please add at least one valid donation.');
        return;
      }

      const submissionData = {
        paymentType,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        mobile: formData.mobile,
        fullname: formData.fullname,
        address: formData.address,
        donations,
      };

      console.log('Submission Data:', submissionData);

      // Retrieve token (this example assumes it's in local storage)
      const token = Cookies.get('token');

      const response = await fetch(`${API_BASE_URL}/donationDetail/createDonation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the token here
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const result = await response.json();
      toast.success('Donation submitted successfully!');
      window.location.reload();

      setFormData({
        fullname: '',
        mobile: '',
        address: '',
        donation: [],
      });

    } catch (error) {
      toast.error('Error submitting donation: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Set the current date in the desired format
    setCurrentDate(new Date().toISOString().split('T')[0]);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const donationItems = [
    { id: 1, itemType_en: "GOLD STOCK DONATION", itemType_hi: "स्वर्ण उपहार दान खाते जमा ", status: 1 },
    { id: 2, itemType_en: "SILVER STOCK DONATION", itemType_hi: "चांदी उपहार दान खाते जमा ", status: 1 },
    { id: 3, itemType_en: "GIFT ITEM DONATION", itemType_hi: "उपहार दान खाते जमा ", status: 1 }
  ];

  const [isHindi, setIsHindi] = useState(false);
  const toggleLanguage = () => {
    setIsHindi(!isHindi); // Toggle between Hindi and English
  };

  const headings = {
    cash: isHindi ? "नकद भुगतान विवरण" : "Cash Payment Details",
    cheque: isHindi ? "चेक भुगतान विवरण" : "Cheque Payment Details",
    electronic: isHindi ? "इलेक्ट्रॉनिक भुगतान विवरण" : "Electronic Payment Details",
    item: isHindi ? "आइटम विवरण" : "Item Details",
    totalAmount: isHindi ? "कुल राशि" : "Total Amount",
    amount: isHindi ? "राशि" : "Amount",
    submit: isHindi ? "दान सबमिट करें" : "Submit Donation",
    date: isHindi ? "तारीख:" : "Date:",
    time: isHindi ? "समय:" : "Time:",
    mobile: isHindi ? "मोबाइल:" : "Mobile:",
    fullName: isHindi ? "पूरा नाम:" : "Full Name:",
    address: isHindi ? "पता:" : "Address:",
    bankName: isHindi ? "बैंक नाम:" : "Bank Name:",
    transactionNo: isHindi ? "लेनदेन संख्या:" : "Transaction No:",
    chequeNo: isHindi ? "चेक संख्या:" : "Cheque No:",
    chequeDate: isHindi ? "चेक तिथि:" : "Cheque Date:",
    itemType: isHindi ? "आइटम प्रकार:" : "Item Type:",
    size: isHindi ? "आकार:" : "Size:",
    units: isHindi ? "इकाइयाँ:" : "Units:",
    quantity: isHindi ? "मात्रा:" : "Quantity:",
    approxValue: isHindi ? "अनुमानित मूल्य:" : "Approx. Value:",
    remove: isHindi ? "हटाएं" : "Remove",
    typeDonaion : isHindi ? "दान के कई प्रकार" : "Type Of Donation",
    remark : isHindi ? "टिप्पणी" : "Remark",
    action : isHindi ? "कार्रवाई" : "Actions"
  };


  return (
    <Section>
      {isLoading && <Spinner />}
      <ToastContainer position="top-right" autoClose={5000} />
      <button onClick={toggleLanguage} className="p-2 bg-blue-500 text-white rounded">
        {isHindi ? "Switch to English" : "हिंदी में स्विच करें"}
      </button>
      <div className="flex space-x-4 ml-6 border-gray-300">
        {['cash', 'cheque', 'electronic', 'item'].map((type) => (
          <button
            key={type}
            onClick={() => handlePaymentTypeChange(type)}
            className={`py-2 px-4 rounded-lg transition-colors ${paymentType === type
              ? 'bg-orange-400 text-white'
              : 'text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white'
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-white ">
        <div className='grid md:grid-cols-3 gap-4'>
          <label className="block">
          {headings.date}
            <input type="text" name="address" value={currentDate} disabled className="input mt-1 border border-gray-300 rounded p-2 w-full" />
          </label>
          <label className="block">
          {headings.time}
            <input type="text" name="address" value={currentTime} disabled className="input mt-1 border border-gray-300 rounded p-2 w-full" />
          </label>
          <label className="block">
          {headings.mobile}
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required className="input mt-1 border border-gray-300 rounded p-2 w-full" />
          </label>
          <label className="block">
          {headings.fullName}
            <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required className="input mt-1 border border-gray-300 rounded p-2 w-full" />
          </label>
          <label className="block">
          {headings.address}
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="input mt-1 border border-gray-300 rounded p-2 w-full" />
          </label>
        </div>

        {/* Payments Table */}
        <div>
          {paymentType === 'cash' && (
            <>
              <h3 className="text-lg font-semibold mt-4">{headings.cash}</h3>
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 flex justify-between items-center">{headings.typeDonaion}<span onClick={handleAddPayment}><FaPlusSquare className="text-blue-500 text-3xl" /></span></th>
                    <th className="border border-gray-300 p-2">{headings.amount}</th>
                    <th className="border border-gray-300 p-2">{headings.remark}</th>
                    <th className="border border-gray-300 p-2">{headings.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.donation.map((payment, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <select
                          name="typeOfDonation"
                          value={payment.typeOfDonation || ''} // Ensure it initializes properly
                          onChange={(e) => handlePaymentChange(index, e)} // Pass the event directly
                          className="border rounded-md p-1 w-full"
                        >
                          <option value="" disabled>Select Donation Type</option>
                          {donationTypes.map((type) => (
                            <option key={type._id} value={type._id}>{type.nameHindi}</option>
                          ))}
                        </select>
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
                        <button
                          type="button"
                          onClick={() => handleRemovePayment(index)}
                          className="bg-red-500 text-white rounded-md px-2 py-1"
                        >
                          {headings.remove}
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="border border-gray-300 p-2">{headings.totalAmount}</td>
                    <td className="border border-gray-300 p-2">
                      ₹ {formData.donation.reduce((total, payment) => total + Number(payment.amount || 0), 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {paymentType === 'cheque' && (
            <>
              <h3 className="text-lg font-semibold mt-4">{headings.cheque}</h3>
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 flex justify-between items-center text-nowrap">{headings.typeDonaion}<span onClick={handleAddPayment}><FaPlusSquare className="text-blue-500 text-3xl" /></span></th>
                    <th className="border border-gray-300 p-2 text-nowrap">{headings.amount}</th>
                    <th className="border border-gray-300 p-2 text-nowrap">{headings.remark}</th>
                    <th className="border border-gray-300 p-2 text-nowrap">{headings.bankName}</th>
                    <th className="border border-gray-300 p-2 text-nowrap">{headings.transactionNo}</th>
                    <th className="border border-gray-300 p-2 text-nowrap">{headings.chequeNo}</th>
                    <th className="border border-gray-300 p-2 text-nowrap">{headings.chequeDate}</th>
                    <th className="border border-gray-300 p-2 text-nowrap">{headings.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.donation.map((payment, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <select
                          name="typeOfDonation"
                          value={payment.typeOfDonation || ''} // Ensure it initializes properly
                          onChange={(e) => handlePaymentChange(index, e)} // Pass the event directly
                          className="border rounded-md p-1 w-full"
                        >
                          <option value="" disabled>Select Donation Type</option>
                          {donationTypes.map((type) => (
                            <option key={type._id} value={type._id}>{type.nameHindi}</option>
                          ))}
                        </select>
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
                        <input
                          type="text"
                          name="bankName"
                          value={payment.bankName}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          name="transactionNo"
                          value={payment.transactionNo}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          name="chequeNo"
                          value={payment.chequeNo}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="date"
                          name="chequeDate"
                          value={payment.chequeDate}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button type="button" onClick={() => handleRemovePayment(index)} className="text-red-500">{headings.remove}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {paymentType === 'electronic' && (
            <>
              <h3 className="text-lg font-semibold mt-4">{headings.electronic}</h3>
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 flex justify-between items-center text-nowrap">{headings.typeDonaion}<span onClick={handleAddPayment}><FaPlusSquare className="text-blue-500 text-3xl" /></span></th>
                    <th className="border border-gray-300 p-2">{headings.amount}</th>
                    <th className="border border-gray-300 p-2">{headings.bankName}</th>
                    <th className="border border-gray-300 p-2">{headings.transactionNo}</th>
                    <th className="border border-gray-300 p-2">{headings.remark}</th>
                    <th className="border border-gray-300 p-2">{headings.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.donation.map((payment, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <select
                          name="typeOfDonation"
                          value={payment.typeOfDonation || ''} // Ensure it initializes properly
                          onChange={(e) => handlePaymentChange(index, e)} // Pass the event directly
                          className="border rounded-md p-1 w-full"
                        >
                          <option value="" disabled>Select Donation Type</option>
                          {donationTypes.map((type) => (
                            <option key={type._id} value={type._id}>{type.nameHindi}</option>
                          ))}
                        </select>
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
                          name="bankName"
                          value={payment.bankName}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          name="transactionNo"
                          value={payment.transactionNo}
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
                        <button type="button" onClick={() => handleRemovePayment(index)} className="text-red-500">{headings.remove}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {paymentType === 'item' && (
            <>
              <h3 className="text-lg font-semibold mt-4">{headings.item}</h3>
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 flex justify-between items-center text-nowrap">Donation Item<span onClick={handleAddPayment}><FaPlusSquare className="text-blue-500 text-3xl" /></span></th>
                    <th className="border border-gray-300 p-2">{headings.itemType}</th>
                    <th className="border border-gray-300 p-2">{headings.size}</th>
                    <th className="border border-gray-300 p-2">{headings.units}</th>
                    <th className="border border-gray-300 p-2">{headings.quantity}</th>
                    <th className="border border-gray-300 p-2">{headings.approxValue}</th>
                    <th className="border border-gray-300 p-2">{headings.remark}</th>
                    <th className="border border-gray-300 p-2">{headings.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.donation.map((payment, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <select
                          name="donationItem"
                          value={payment.donationItem || ''}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        >
                          <option value="" disabled>Select Donation Item</option>
                          {donationItems.map((type) => (
                            <option key={type.id} value={type.itemType_hi}>
                              {type.itemType_hi}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          name="itemType"
                          value={payment.itemType}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>

                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          name="size"
                          value={payment.size}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <select
                          name="units"
                          value={payment.units}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        >
                          <option value="" disabled>Select Unit</option>
                          <option value="G">G</option>
                          <option value="KG">KG</option>
                          <option value="MG">MG</option>
                          <option value="UG">UG</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          name="quantity"
                          value={payment.quantity}
                          onChange={(e) => handlePaymentChange(index, e)}
                          className="border rounded-md p-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
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
                        <button type="button" onClick={() => handleRemovePayment(index)} className="text-red-500">{headings.remove}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="mt-4 p-2 bg-green-500 text-white rounded">{headings.submit}</button>
        </div>
      </form>
    </Section>
  );
};

export default AddDonation;
