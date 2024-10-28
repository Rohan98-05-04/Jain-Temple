import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE_URL } from "../../../../utils/config";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import Section from "@aio/components/Section";
import styles from "../mandir-users.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner';

export default function UpdateMandirUsers({ DonorId }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumberOne, setPhoneNumberOne] = useState('');
  const [phoneNumberTwo, setPhoneNumberTwo] = useState('');
  const [gotr, setGotr] = useState('');
  const [dob, setDob] = useState('');
  const [dateOfAnniversary, setDateOfAnniversary] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [aadharNo, setAadharcardnumber] = useState('');
  const [aadharCardImage, setAadharcardimage] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [addressLineOne, setAddressLineOne] = useState('');
  const [addressLineTwo, setAddressLineTwo] = useState('');
  const [addressLineThree, setAddressLineThree] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  const [members, setMember] = useState([]);
  const [isHead, setIsHeadOfFamily] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()
  const slug = router.query;
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const relationOptions = [
    { value: 'son', label: 'Son' },
    { value: 'daughter', label: 'Daughter' },
    { value: 'spouse', label: 'Spouse' },
    // Add more options as needed
  ];
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Inside the onloadend event, the result is available
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const maxDate = new Date();
  useEffect(() => {
    if (DonorId) {
      let jsonString = [];
      const token = localStorage.getItem('token');
      const parseToken = JSON.parse(token) || {};
      const fetchData = async () => {
        const response = await fetch(`${API_BASE_URL}/donor/getdonor/${DonorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${parseToken}`,

          },
          body: JSON.stringify(),
        });

        if (response.ok) {

          const data = await response.json();
          jsonString = data.data;
          console.log(jsonString)
          if (jsonString) {
            const existingObject = jsonString;
            // setExistingData(existingObject);
            setImage(existingObject.image || '');
            setFirstName(existingObject.firstName || '');
            setLastName(existingObject.lastName || '');
            setGotr(existingObject.gotr || '');
            setPhoneNumberOne(existingObject.phoneNumbers[0].Phonenumber1 || '');
            setPhoneNumberTwo(existingObject.phoneNumbers[0].Phonenumber2 || '');
            setDob(existingObject.dob ? new Date(existingObject.dob) : null);
            setDateOfAnniversary(existingObject.dateOfAnniversary ? new Date(existingObject.dateOfAnniversary) : null);
            setEmail(existingObject.email || '');
            setIsHeadOfFamily(existingObject.isHead || '');
            setOccupation(existingObject.occupation || '');
            setAadharcardnumber(existingObject.aadharNo || '');
            setAadharcardimage(existingObject.aadharCardImage || '');
            setBloodGroup(existingObject.bloodGroup || '');
            setAddressLineOne(existingObject.address?.line_1 || '');
            setAddressLineTwo(existingObject.address?.line_2 || '');
            setAddressLineThree(existingObject.address?.line_3 || '');
            setCity(existingObject.address?.city || '');
            setState(existingObject.address?.state || '');
            setPincode(existingObject.address?.pincode || '');
            setCountry(existingObject.address?.country || '');
            setSelectedRole(existingObject.role || '');
            const parsedMembers = existingObject.members.map((member) => ({
              ...member,
              dob: member.dob ? new Date(member.dob) : null,
            }));
            setMember(parsedMembers);
          }
        } else {
          const data = await response.json();
          toast.success(data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
      fetchData();
    }
  }, [DonorId]);
  const handleUpload = (e) => {
    e.preventDefault();
    // In this function, you can send the image data (URL) to the backend
    // For example, you can use fetch() or an API library to make the POST request
    if (image) {
      // Here, 'image' contains the base64 encoded data URL of the uploaded image
      // Send this data to the backend using a POST request
    }
  };

  const handleDateChange = (date) => {
    setDob(date);
    if (date instanceof Date && !isNaN(date)) {
      setError('');
    } else {
      setError('Invalid date format. Please enter a valid date.');
    }
  };
  const handledateOfAnniversaryChange = (date) => {
    setDateOfAnniversary(date);
    if (date instanceof Date && !isNaN(date)) {
      setError('');
    } else {
      setError('Invalid date format. Please enter a valid date.');
    }
  };
  const validateInput = (input) => {
    return input.firstName.trim() !== "" && input.lastName.trim() !== "" &&
      input.relation.trim() !== "";
  };
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const handleFileChange = (event) => {
    uploadImageCloudfare(event.target.files, setLoading, setFileUploaded);

    //setFile(event.target.files[0]);
  };
  const handleMemberChange = (e, index, field) => {
    const value = e.target.value;
    setMember((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index][field] = value;
      return updatedMembers;
    });
  };
  const handleMemberChangeDate = (date, index) => {
    setMember((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index].dob = date;
      return updatedMembers;
    });
  };

  const handleMemberChangeDropdown = (selectedOption, index) => {
    setMember((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[index].relation = selectedOption;
      return updatedMembers;
    });
  };

  const addMember = () => {


    const newMember = {
      firstName: '',
      lastName: '',
      dob: '',
      occupation: '',
      aadharNo: '',
      phoneNumber: '',
      email: '',
      bloodGroup: '',
    };
    const areAllMembersValid = members.every(
      (member) =>
        member.firstName && member.lastName && member.dob && member.relation
    );

    if (areAllMembersValid) {
      setMember((prevMembers) => [...prevMembers, newMember]);
    } else {
      toast.error('Please fill required fields of member.', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleSignup = () => {
    if (firstName.trim() === '' || lastName.trim() === '') {
      toast.error('Please fill required fields.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const areAllMembersValid = members.every(
      (member) =>
        member.firstName && member.lastName && member.dob && member.relation
    );

    if (!areAllMembersValid) {
      toast.error('Please fill required fields of all member.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!isHead) {
      setMember([])
    }
    const token = localStorage.getItem('token');
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/donor/donarupdate/${DonorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,

        },

        body: JSON.stringify({
          image, firstName, lastName, "phoneNumbers": [
            {
              "Phonenumber1": phoneNumberOne,
              "Phonenumber2": phoneNumberTwo
            }
          ], dob, gotr, dateOfAnniversary, isHead, role : selectedRole,
          occupation, email, aadharNo, aadharCardImage, bloodGroup, address: {
            "line_1": addressLineOne,
            "line_2": addressLineTwo,
            "line_3": addressLineThree,
            "city": city,
            "state": state,
            "pincode": pincode,
            "country": country
          }, members
        }),
      });

      if (response.ok) {

        const data = await response.json();
        // localStorage.remove('donarDetail');
        toast.success('Update successful', {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push('/mandir-users');
        setIsLoading(false);
      } else {
        const data = await response.json();
        toast.error(data.errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false);
      }
    }
    fetchData();
  };

  const [donationTypes, setDonationTypes] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchBoliHeads = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/role/getAllMemberRoles`);
        const result = await response.json();
        setDonationTypes(result.data.roles);
        console.log(result);
      } catch (error) {
        console.error("Error fetching Boli Heads:", error);
      }
    };

    fetchBoliHeads();
  }, []);

  const handleRoleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedRole(selectedValue);
  };

  return (
    <Section>
      {isLoading && <Spinner />}
      <div className="donarPage">
        <ToastContainer position="top-right" autoClose={5000} />

        <div className="addDonarForm">
          <h2 className={`${styles.formHeaderext}`}>Update mandir user details</h2>
          <form>
            <div className="formMainDiv">

              <div className="label-form firstName">
                <label htmlFor="firstName">First Name*</label><br />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="label-form lastName">
                <label htmlFor="lastName">Last Name*</label><br />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="label-form phoneTwo">
                <label htmlFor="Gotr">Gotr</label><br />
                <input
                  type="text"
                  id="Gotr"
                  name="gotr"
                  value={gotr}
                  onChange={(e) => setGotr(e.target.value)}
                />
              </div>
              <div className="label-form phoneOne">
                <label htmlFor="PhoneNumberOne">Whatsapp Number*</label><br />
                <input
                  type="number"
                  id="PhoneNumberOne"
                  name="PhoneNumberOne"
                  value={phoneNumberOne}
                  onChange={(e) => setPhoneNumberOne(e.target.value)}
                />
              </div>
              <div className="label-form phoneTwo">
                <label htmlFor="PhoneNumberTwo">Phone Number</label><br />
                <input
                  type="number"
                  id="PhoneNumberTwo"
                  name="PhoneNumberTwo"
                  value={phoneNumberTwo}
                  onChange={(e) => setPhoneNumberTwo(e.target.value)}
                />
              </div>

              <div className="donationTypeInput">
                <p className="formLabel">Is head member</p>
                <div className="d-flex">

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      onChange={() => setIsHeadOfFamily(true)}

                      checked={isHead}
                    />
                    <label className="form-check-label" for="flexRadioDefault1">
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      // onChange={() => setIsEventSelected(false)}
                      onChange={() => setIsHeadOfFamily(false)}
                    />
                    <label className="form-check-label" for="flexRadioDefault2">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="label-form dobDiv">
                <label htmlFor="Dob">DOB</label><br />
                <DatePicker showYearDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  maxDate={maxDate}
                  selected={dob}
                  onChange={handleDateChange}
                  dateFormat="MM/dd/yyyy" />

              </div>
              <div className="label-form dobDiv">
                <label htmlFor="dateOfAnniversary">Date of Anniversary</label><br />
                <DatePicker showYearDropdown
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  maxDate={maxDate}
                  selected={dateOfAnniversary}
                  onChange={handledateOfAnniversaryChange}
                  dateFormat="MM/dd/yyyy" />


              </div>
              <div className="label-form emailDiv">
                <label htmlFor="email">Email</label><br />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="label-form occupationDiv">
                <label htmlFor="occupation">Occupation</label><br />
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>

              <div className="label-form aadharNum">
                <label htmlFor="aadharNo">Aadhar card number</label><br />
                <input
                  type="text"
                  id="aadharNo"
                  name="aadharNo"
                  value={aadharNo}
                  onChange={(e) => setAadharcardnumber(e.target.value)}
                />
              </div>
              {/* <div className="label-form aadharImg">
                <label htmlFor="aadharcardimage">Aadhar card image</label><br />
              <input
                type="file"
                id="aadharcardimage"
                name="aadharCardImage"
                value={aadharCardImage}
                onChange={(e) => setAadharcardimage(e.target.value)}
                />
                </div> */}

              <div className="label-form bloodGroup">
                <label htmlFor="bloodGroup">Blood Group</label><br />
                <input
                  type="text"
                  id="bloodGroup"
                  name="bloodGroup"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                />
              </div>
              <div className="label-form addOne">
                <label htmlFor="addressLineOne">Address</label><br />
                <input
                  type="text"
                  id="addressLineOne"
                  name="addressLineOne"
                  value={addressLineOne}
                  onChange={(e) => setAddressLineOne(e.target.value)}
                />
              </div>
              {/* <div className="label-form addTwo">
                <label htmlFor="addressLineTwo">Address Line two</label><br />
              <input
                type="text"
                name="addressLineTwo"
                value={addressLineTwo}
                onChange={(e) => setAddressLineTwo(e.target.value)}
                />
                </div>
              <div className="label-form addThree">
                <label htmlFor="addressLineThree">Address Line three</label><br />
              <input
                type="text"
                id="addressLineThree"
                name="addressLineThree"
                value={addressLineThree}
                onChange={(e) => setAddressLineThree(e.target.value)}
                />
                </div> */}

              <div className="label-form city">
                <label htmlFor="city">City</label><br />
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="label-form state">
                <label htmlFor="state">State</label><br />
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="label-form pincode">
                <label htmlFor="pincode">Pincode</label><br />
                <input
                  type="number"
                  id="pincode"
                  name="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
              {/* <div className="label-form role">
                <label htmlFor="role">Role</label><br />
                <select
                  name="role"
                  value={selectedRole} // Set the value to the selected role state
                  onChange={handleRoleChange}
                  className="border border-gray-950 p-1 py-3 w-full"
                >
                  <option value="" disabled>Select Role Type</option>
                  {donationTypes?.map((type) => (
                    <option key={type._id} value={type._id}>{type.nameHindi}</option>
                  ))}
                </select>
              </div> */}
              {/* <div className="label-form country">
                <label htmlFor="country">Country</label><br />
              <input
                type="text"
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                />
                </div> */}
            </div>
            {isHead && (
              <div>
                {members.map((member, index) => (
                  <div key={index} className="memberContainer border p-2">
                    <h3 className="memberCount">Member {index + 1}</h3>
                    <div className="formMainDiv">

                      <div className="label-form">
                        <label htmlFor={`firstName${index}`}>First Name*</label><br />
                        <input
                          type="text"
                          id={`firstName${index}`}
                          value={member.firstName}
                          onChange={(e) => handleMemberChange(e, index, 'firstName')}
                        />
                      </div>
                      <div className="label-form">
                        <label htmlFor={`lastName${index}`}>last Name*</label><br />
                        <input
                          type="text"
                          id={`lastName${index}`}
                          value={member.lastName}
                          onChange={(e) => handleMemberChange(e, index, 'lastName')}
                        />
                      </div>
                      <div className="label-form">
                        <label htmlFor={`phoneNumber${index}`}>Phone number</label><br />
                        <input
                          type="number"
                          id={`phoneNumber${index}`}
                          value={member.phoneNumber}
                          onChange={(e) => handleMemberChange(e, index, 'phoneNumber')}
                        />
                      </div>
                      <div className="label-form">
                        <label>Date of Birth</label><br />
                        <DatePicker
                          showYearDropdown
                          yearDropdownItemNumber={100}
                          scrollableYearDropdown
                          maxDate={maxDate}
                          selected={member.dob || null}
                          onChange={(date) => handleMemberChangeDate(date, index)}
                          dateFormat="MM/dd/yyyy"
                        />
                      </div>
                      {/* <div className="label-form">
      <label>Relation</label><br />
      <Select
        options={relationOptions}
        value={member.relation}
        onChange={(selectedOption) => handleMemberChangeDropdown(selectedOption, index)}
      />
    </div> */}
                      <div className="label-form ">
                        <label htmlFor="Relation">Relation*</label>
                        <br />
                        <div className="input-group mb-3">
                          <input
                            list="options"
                            id={`inputDropdown_${index}`} // Add unique identifier based on index
                            name="relation"
                            className="form-control"
                            value={member.relation} // Use x.relation instead of x.firstName
                            onChange={(e) => handleMemberChange(e, index, 'relation')}
                          />
                          <datalist id="options">
                            <option value="Spouse" />
                            <option value="Son" />
                            <option value="Daughter" />
                          </datalist>
                        </div>
                      </div>

                      <div className="label-form">
                        <label htmlFor={`email${index}`}>Email</label><br />
                        <input
                          type="email"
                          id={`email${index}`}
                          value={member.email}
                          onChange={(e) => handleMemberChange(e, index, 'email')}
                        />
                      </div>
                      <div className="label-form">
                        <label htmlFor={`occupation${index}`}>Occupation</label><br />
                        <input
                          type="occupation"
                          id={`occupation${index}`}
                          value={member.occupation}
                          onChange={(e) => handleMemberChange(e, index, 'occupation')}
                        />
                      </div>
                      <div className="label-form">
                        <label htmlFor={`aadharNo${index}`}>Aadhar Number</label><br />
                        <input
                          type="aadharNo"
                          id={`aadharNo${index}`}
                          value={member.aadharNo}
                          onChange={(e) => handleMemberChange(e, index, 'aadharNo')}
                        />
                      </div>
                      <div className="label-form">
                        <label htmlFor={`bloodGroup${index}`}>Blood Group</label><br />
                        <input
                          type="bloodGroup"
                          id={`bloodGroup${index}`}
                          value={member.bloodGroup}
                          onChange={(e) => handleMemberChange(e, index, 'bloodGroup')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="d-flex">

              <div className="addDonarSubmitBtnMain">

                <button className="addDonarSubmitBtn" type="button" onClick={handleSignup}>
                  Update
                </button>
              </div>
              {isHead && (
                <div className="addDonarSubmitBtnMain nextDonarSubmitBtnMain">

                  <button className="addDonarSubmitBtn nextDonarSubmitBtn" type="button" onClick={addMember}>
                    add member
                  </button>
                </div>
              )}
            </div>
            {/* <h2 className="signupText">Already have an account?<Link href='/Sign-in'> Sign In</Link></h2> */}
          </form>
        </div>
      </div>
    </Section>
  );

}