import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import { ToastContainer, toast } from 'react-toastify';
import Section from "@aio/components/Section";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../../components/Spinner'; 

export default function AddEventCategories({ onSuccess }) {
  const [name, setEventNameCategory] = useState("");
  const [description, setEventDetailCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const addEventCategory = () => {
    if (name.trim() === "" || description.trim() === "") {
      alert("Please fill required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/event/addeventCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Added successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        onSuccess();
        setIsLoading(false);
      } else {
        const data = await response.json();
        toast.error(data.errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false);
      }
    };
    fetchData();
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <div className="w-full px-6">
        <ToastContainer position="top-right" autoClose={5000} />
        <h2 className="text-3xl font-semibold mb-4 text-center">Enter Event Category</h2>
        <form>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name Category</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setEventNameCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Event Detail Category</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setEventDetailCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
              onClick={addEventCategory}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}
