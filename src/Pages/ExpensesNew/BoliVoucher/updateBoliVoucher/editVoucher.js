// components/EditBoliForm.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE_URL } from "utils/config";

const EditBoliVoucher = ({ id, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ledgerNumber, setLedgerNumber] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [voucherType, setvoucherType] = useState("Received");
  const [formData, setFormData] = useState({
    expenseType: "expensevoucher",
    narration: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    mobile: "",
    fullname: "",
    fathersName: "",
    address: "",
    email: "",
    vouchers: [], // Initialize vouchers array
  });

  const paymentOptions = [
    { value: "Cash", label: "Cash", icon: "💵" },
    { value: "Credit Card", label: "Credit Card", icon: "💳" },
    { value: "UPI", label: "UPI", icon: "📧" },
    { value: "Bank Transfer", label: "Bank Transfer", icon: "🏦" },
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
      vouchers: [
        ...formData.vouchers,
        { expenseHead: "", remark: "", amount: "" },
      ],
    });
  };

  const handleRemovePayment = (index) => {
    const updatedVoucher = formData.vouchers.filter((_, i) => i !== index);
    setFormData({ ...formData, vouchers: updatedVoucher });
  };

  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVoucher = [...formData.vouchers];

    // Parse the amount to a number if the name is 'boliAmount'
    if (name === "amount") {
      updatedVoucher[index] = {
        ...updatedVoucher[index],
        [name]: Number(value),
      };
    } else {
      updatedVoucher[index] = { ...updatedVoucher[index], [name]: value };
    }

    setFormData({ ...formData, vouchers: updatedVoucher });
  };

  const fetchBoliHeads = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/boliDetail/getAllBolis?boliType=bolivoucher`
      );
      const result = await response.json();
      if (response.ok && Array.isArray(result.data?.data)) {
        setDonationTypes(result.data.data);
      } else {
        toast.error("Failed to fetch Expense Heads");
      }
    } catch (error) {
      toast.error("Error fetching Expense Heads: Network error");
      console.error("Error fetching Expense Heads:", error);
    }
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      voucherType,
      paymentMode: paymentType,
    };

    const response = await fetch(
      `${API_BASE_URL}/expenses/updateExpense/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      }
    );

    if (response.ok) {
      toast.success("Expense Group updated successfully");
      onSuccess();
    } else {
      toast.error("Failed to update Expense");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/expenses/getExpenseById/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setFormData(data.data);
        setPaymentType(data.data.paymentMode);
        setvoucherType(data.data.voucherType);
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

  const donationItems = [
    {
      id: 1,
      itemType_en: "GOLD STOCK DONATION",
      itemType_hi: "स्वर्ण उपहार दान खाते जमा ",
      status: 1,
    },
    {
      id: 2,
      itemType_en: "SILVER STOCK DONATION",
      itemType_hi: "चांदी उपहार दान खाते जमा ",
      status: 1,
    },
    {
      id: 3,
      itemType_en: "GIFT ITEM DONATION",
      itemType_hi: "उपहार दान खाते जमा ",
      status: 1,
    },
  ];

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Set the current date in the desired format
    setCurrentDate(new Date().toISOString().split("T")[0]);
    setCurrentTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const [language, setLanguage] = useState("en"); // Default language is English

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const isHindi = language === "hi";

  const headings = {
    fullName: isHindi ? "पूरा नाम" : "Full Name",
    fathersName: isHindi ? "पिता का नाम" : "Father's Name",
    mobile: isHindi ? "मोबाइल नंबर" : "Mobile No.",
    address: isHindi ? "पता" : "Address",
    email: isHindi ? "ईमेल" : "Email",
    pincode: isHindi ? "पिनकोड" : "Pincode",
    city: isHindi ? "शहर" : "City",
    state: isHindi ? "राज्य" : "State",
    country: isHindi ? "देश" : "Country",
    paymentMode: isHindi ? "भुगतान मोड" : "Payment Mode",
    narration: isHindi ? "विवरण" : "Narration",
    expenseDetails: isHindi ? "व्यय विवरण" : "Expense Details",
    expenseHead: isHindi ? "व्यय शीर्षक" : "Expense Head",
    amount: isHindi ? "राशि" : "Amount",
    remark: isHindi ? "टिप्पणी" : "Remark",
    action: isHindi ? "कार्य" : "Actions",
    remove: isHindi ? "हटाएं" : "Remove",
    submit: isHindi ? "जमा करें" : "Submit",
    details: isHindi ? "व्यय विवरण" : "Expense Details",
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      <div className="mb-4">
        <label>Choose the language : </label>
        <button
          onClick={() => toggleLanguage("en")}
          type="button"
          className={`py-2 px-4 rounded-lg ml-2 transition-colors ${
            language === "en"
              ? "bg-orange-400 text-white"
              : "text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white"
          }`}
        >
          English
        </button>
        <button
          onClick={() => toggleLanguage("hi")}
          type="button"
          className={`py-2 px-4 rounded-lg ml-4 transition-colors ${
            language === "hi"
              ? "bg-orange-400 text-white"
              : "text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white"
          }`}
        >
          हिंदी
        </button>
      </div>
      <div className="mb-8 flex justify-between">
        <div className="flex space-x-4 border-gray-300">
          {["Received", "cheque", "electronic", "item"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={(e) => {
                setvoucherType(type);
              }}
              className={`py-2 px-4 rounded-lg transition-colors ${
                voucherType === type
                  ? "bg-orange-400 text-white"
                  : "text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div>
          {currentDate}/{currentTime}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fullName"
          >
            {headings.fullName}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fathersName"
          >
            {headings.fathersName}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mobile"
          >
            {headings.mobile}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            {headings.address}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            {headings.email}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pincode"
          >
            {headings.pincode}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="state"
          >
            {headings.city}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="state"
          >
            {headings.state}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="country"
          >
            {headings.country}
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="groupname"
          >
            {headings.paymentMode}
          </label>
          <select
            name="donationItem"
            value={paymentType}
            onChange={handlePaymentModeChange}
            className="border rounded-md p-1 w-full h-14"
          >
            <option value="" disabled>
              Select Donation Item
            </option>
            {paymentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fatherName"
          >
            {headings.narration}
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
        <h3 className="text-lg font-semibold mt-4">{headings.details}</h3>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 flex justify-between text-nowrap">
                {headings.expenseHead}
                <span onClick={handleAddPayment}>
                  <FaPlusSquare className="text-blue-500 text-3xl" />
                </span>
              </th>
              <th className="border border-gray-300 p-2">{headings.amount}</th>
              <th className="border border-gray-300 p-2">{headings.remark}</th>
              <th className="border border-gray-300 p-2">{headings.action}</th>
            </tr>
          </thead>
          <tbody>
            {formData.vouchers.map((payment, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <select
                    name="expenseHead"
                    value={payment.expenseHead || ""}
                    onChange={(e) => handlePaymentChange(index, e)}
                    className="border rounded-md p-1 w-full"
                  >
                    <option value="" disabled>
                      Select Expense Head Type
                    </option>
                    {donationItems?.map((type) => (
                      <option key={type.id} value={type.itemType_hi}>
                        {type.itemType_hi}
                      </option>
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
                    className="text-red-500"
                  >
                    {headings.remove}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {headings.submit}
      </button>
    </form>
  );
};

export default EditBoliVoucher;
