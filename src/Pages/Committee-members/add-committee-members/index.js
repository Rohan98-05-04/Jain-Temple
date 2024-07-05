import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { API_BASE_URL } from "../../../../utils/config";
import Select from 'react-select'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import Section from "@aio/components/Section";
import styles from "../committeeMembers.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner'; 

export default function AddCommitteeMembers() {
    const [email, setEmail] = useState('');
    const [loginId, setLoginid] = useState('');
    const [role, setRole] = useState('');
    const [selectedRole, setSelectedRole] = useState(null); // Store the selected role object

    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [line_1, setLine_1] = useState('');
    const [line_2, setLine_2] = useState('');
    const [line_3, setLine_3] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('');
    const [ExistingRole, setexistingRole] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const options = [
      { value: 'admin', label: 'admin' },
      { value: 'superadmin', label: 'superadmin' },
    ];
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      };

      useEffect(() => {
   
        const token = localStorage.getItem('token');
                const parseToken = JSON.parse(token) || {};
                setIsLoading(true);

        const fetchData = async () => {
          const response = await fetch(`${API_BASE_URL}/role/allrole`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${parseToken}`,
      
            },
            body: JSON.stringify(),
          });
      
          if (response.ok) {
            
            const data = await response.json();
            setexistingRole(data.data)
            setIsLoading(false);

          } else {
            const data = await response.json();
            console.error(data.errorMessage);
            setIsLoading(false);

          }
          }
          fetchData();
      }, []);

    const handleSignup = () => {
      const token = localStorage.getItem('token');
      const parseToken = JSON.parse(token) || {};

        
      setIsLoading(true);

      const fetchData = async () => {
        const response = await fetch(`${API_BASE_URL}/users/addUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${parseToken}`,
          },
          body: JSON.stringify({name, phonenumber,role: selectedRole?.value // Use selectedRole's value
          ,address:{line_1,
            line_2,pincode,line_3,
            city,
            state,
            country},loginId, email, password }),
        });
    
        if (response.ok) {
          
          const data = await response.json();
          // const jsonString = JSON.stringify(data.accessToken);
          // localStorage.setItem('token', jsonString);
          toast.success('Add successfully', {
            position: toast.POSITION.TOP_RIGHT,
          });
          router.push('/committee-members');
          setIsLoading(false);
          
        } else {
          const data = await response.json();
          setIsLoading(false);
          toast.error(data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
      fetchData();
        }
    return (
        <Section>
           {isLoading &&    <Spinner/>  }
        <div className="signupPage">
         <ToastContainer position="top-right" autoClose={5000} />

          <div className="signupFormMain">
            <h2 className={`${styles.formHeaderext}`}>Enter commitee member details!</h2>
            <form>
            <div className="formMainDiv">

            <div className="label-form">
                <label htmlFor="name">Name</label><br />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              </div>
            <div className="label-form">
                <label htmlFor="phonenumber">Phone Number</label><br />
              <input
                type="number"
                id="phonenumber"
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
              </div>
              <div className="label-form eventInp donationDrop">
            <label htmlFor="role">Role</label>
            <br />
            {/* <Select  options={options}
            name="role"
            id="role"
            onChange={(selectedOption) => {
                if (selectedOption) {
                  setRole(selectedOption.value);
                }
              }} 
                    /> */}
              <Select 
              className="selectDropdown"
                options={ExistingRole.map((role) => ({
                  value: role._id,
                  label: role.name, // Show donor's first name
                }))}
                name="role"
                id="role"
                value={selectedRole} // Use selectedRole for value
                onChange={(selectedOption) => setSelectedRole(selectedOption)}
                // onChange={(selectedOption) => {
                //   if (selectedOption) {
                //     const selectedDonor = ExistingRole.find(
                //       (role) => role._id === selectedOption.value
                //     );
                //     setexistingRole(selectedDonor);
                //   }
                // }}
              />      

            
          </div>
            <div className="label-form">
                <label htmlFor="line_1">Address line 1</label><br />
              <input
                type="text"
                id="line_1"
                value={line_1}
                onChange={(e) => setLine_1(e.target.value)}
              />
              </div>
            <div className="label-form">
                <label htmlFor="line_2">Address line 2</label><br />
              <input
                type="text"
                id="line_2"
                value={line_2}
                onChange={(e) => setLine_2(e.target.value)}
              />
              </div>
            <div className="label-form">
                <label htmlFor="line_3">Address line 3</label><br />
              <input
                type="text"
                id="line_3"
                value={line_3}
                onChange={(e) => setLine_3(e.target.value)}
              />
              </div>
            <div className="label-form">
                <label htmlFor="city">City</label><br />
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              </div>
            <div className="label-form">
                <label htmlFor="state">State</label><br />
              <input
                type="text"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              </div>
            <div className="label-form">
                <label htmlFor="pincode">Pincode</label><br />
              <input
                type="text"
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              </div>
            <div className="label-form">
                <label htmlFor="country">Country</label><br />
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              </div>
              <div className="label-form">
                <label htmlFor="loginid">Login Id</label><br />
              <input
                type="text"
                id="loginid"
                value={loginId}
                onChange={(e) => setLoginid(e.target.value)}
                />
                </div>
              <div className="label-form">
                <label htmlFor="email">Email</label><br />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className="label-form">
                <label htmlFor="password">Password</label><br />

              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>
              </div>

            
              <div className="d-flex">
            <div className="submitEvent addDonarSubmitBtnMain">
              <button
                className="addDonarSubmitBtn"
                type="button"
                onClick={handleSignup}
              >
                Add member
              </button>
            </div>
            <div className="nextDonarSubmitBtnMain"></div>
          </div>
            </form>
          </div>
          </div>
          </Section>
        );
      
}