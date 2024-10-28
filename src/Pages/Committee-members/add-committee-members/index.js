import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { API_BASE_URL } from "../../../../utils/config";
import Select from 'react-select';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Section from "@aio/components/Section";
import styles from "../committeeMembers.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner';

export default function AddCommitteeMembers({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [loginId, setLoginid] = useState('');
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [line_1, setLine_1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  const [donationTypes, setDonationTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/role/getAllMemberRoles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonationTypes(data.data.roles);
        console.log(donationTypes)
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSignup = async () => {
    const token = localStorage.getItem('token');
    const parseToken = (token) || {};
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/users/addUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parseToken}`,
      },
      body: JSON.stringify({
        name,
        phonenumber,
        memberRole: selectedRole?._id, // Ensure you're using the ID
        address: {
          line_1,
          pincode,
          city,
          state,
          country,
        },
        loginId,
        email,
        password,
      }),
    });

    if (response.ok) {
      toast.success('Added successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
      onSuccess();
    } else {
      const data = await response.json();
      toast.error(data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setIsLoading(false);
  };

  const handleRoleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = donationTypes.find(role => role._id === selectedValue);
    setSelectedRole(selectedOption);
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <div className="signupPage">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="signupFormMain">
          <h2 className={`${styles.formHeaderext}`}>Enter committee member details!</h2>
          <form>
            <div className="formMainDiv">
              <div className="label-form">
                <label htmlFor="name">Name</label><br />
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="phonenumber">Phone Number</label><br />
                <input type="number" id="phonenumber" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
              </div>
              <div className="label-form role">
                <label htmlFor="role">Role</label><br />
                <select name="role" value={selectedRole?._id || ''} onChange={handleRoleChange} className="border border-gray-950 p-1 py-3 w-full">
                  <option value="" disabled>Select Role Type</option>
                  {donationTypes?.map((type) => (
                    <option key={type._id} value={type._id}>{type.nameHindi}</option>
                  ))}
                </select>
              </div>
              <div className="label-form">
                <label htmlFor="line_1">Address</label><br />
                <input type="text" id="line_1" value={line_1} onChange={(e) => setLine_1(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="city">City</label><br />
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="state">State</label><br />
                <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="pincode">Pincode</label><br />
                <input type="text" id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="country">Country</label><br />
                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="loginid">Login Id</label><br />
                <input type="text" id="loginid" value={loginId} onChange={(e) => setLoginid(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="email">Email</label><br />
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="label-form">
                <label htmlFor="password">Password</label><br />
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="d-flex">
              <div className="submitEvent addDonarSubmitBtnMain">
                <button className="addDonarSubmitBtn" type="button" onClick={handleSignup}>Add member</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
