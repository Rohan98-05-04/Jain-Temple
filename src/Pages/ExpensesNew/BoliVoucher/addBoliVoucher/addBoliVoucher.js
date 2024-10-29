// components/AddBoliForm.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE_URL } from "utils/config";

const AddBoliVoucher = ({ onSuccess }) => {
  const [donationTypes, setDonationTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ledgerNumber, setLedgerNumber] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
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
    groupname: "",
    fathersName: "",
    address: "",
    email: "",
    vouchers: [],
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
    const updatedVouchers = formData.vouchers.filter((_, i) => i !== index);
    setFormData({ ...formData, vouchers: updatedVouchers });
  };

  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVouchers = [...formData.vouchers];
    updatedVouchers[index] = { ...updatedVouchers[index], [name]: value };
    setFormData({ ...formData, vouchers: updatedVouchers });
  };

  const fetchExpenseHeads = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/expenses/getAllExpenseHeads`
      );
      const result = await response.json();
      if (result) {
        setDonationTypes(result.data.data);
        console.log(donationTypes);
      } else {
        toast.error("Failed to fetch Expense Heads");
      }
    } catch (error) {
      toast.error("Error fetching Expense Heads: Network error");
      console.error("Error fetching Expense Heads:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vouchers = formData.vouchers.map((voucher) => ({
      expenseHead: voucher.expenseHead || null,
      amount: Number(voucher.amount),
      remark: voucher.remark || null,
    }));

    const filteredVouchers = vouchers.filter(
      (voucher) => voucher.expenseHead && voucher.amount && voucher.remark
    );

    const submissionData = {
      expenseType: "expensevoucher",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
      narration: formData.narration,
      city: formData.city,
      pincode: formData.pincode,
      state: formData.state,
      country: formData.country,
      mobile: formData.mobile,
      fullname: formData.fullname,
      fathersName: formData.fathersName,
      address: formData.address,
      email: formData.email,
      vouchers: filteredVouchers,
      voucherType,
      paymentMode: paymentType,
    };

    const response = await fetch(`${API_BASE_URL}/expenses/createExpense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (response.ok) {
      toast.success("Expense Voucher created successfully");
      onSuccess();
    } else {
      toast.error("Failed to create Expense");
    }
  };

  useEffect(() => {
    fetchExpenseHeads();
  }, []);

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
    setCurrentTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const [language, setLanguage] = useState("en");

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
    addPayment: isHindi ? "भुगतान जोड़ें" : "Add Payment",
    details: isHindi ? "व्यय विवरण" : "Expense Details",
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      <div className="mb-4">
        <label>Choose the language : </label>
        <button
          type="button"
          onClick={() => toggleLanguage("en")}
          className={`py-2 px-4 rounded-lg ml-2 transition-colors ${
            language === "en"
              ? "bg-orange-400 text-white"
              : "text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => toggleLanguage("hi")}
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
          {["Received", "Cheque", "Electronic", "Item"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setvoucherType(type)}
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
        <div>
          <label>{headings.fullName}</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label>{headings.fathersName}</label>
          <input
            type="text"
            name="fathersName"
            value={formData.fathersName}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{headings.mobile}</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{headings.address}</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{headings.email}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{headings.city}</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{headings.state}</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{headings.country}</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{headings.pincode}</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-4">
          <label>{headings.paymentMode}</label>
          <select
            value={paymentType}
            onChange={handlePaymentModeChange}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
          >
            {paymentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon}
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label>{headings.narration}</label>
          <input
            name="narration"
            value={formData.narration}
            className="input mt-1 border border-gray-300 rounded p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">{headings.expenseDetails}</h2>
        <table className="mt-4 border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 flex justify-between items-center">
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
            {formData.vouchers.map((voucher, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <select
                    name="expenseHead"
                    value={voucher.expenseHead}
                    onChange={(e) => handlePaymentChange(index, e)}
                    className="input mt-1 border border-gray-300 rounded p-2 w-full"
                  >
                    <option value="">Select Expense Head</option>
                    {donationTypes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.nameHindi}{" "}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    name="amount"
                    value={voucher.amount}
                    onChange={(e) => handlePaymentChange(index, e)}
                    className="input mt-1 border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="remark"
                    value={voucher.remark}
                    onChange={(e) => handlePaymentChange(index, e)}
                    className="input mt-1 border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    type="button"
                    onClick={() => handleRemovePayment(index)}
                    className="text-red-500 hover:underline"
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
        className="mt-6 px-8 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {headings.submit}
      </button>
    </form>
  );
};

export default AddBoliVoucher;
