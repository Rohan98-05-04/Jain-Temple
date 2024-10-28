import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../../../../utils/config";
import { ToastContainer, toast } from "react-toastify";
import Section from "@aio/components/Section";
import styles from "../committeeMembers.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateCommitteeMembers({ eventId, onSuccess }) {
  const [email, setEmail] = useState("");
  const [loginId, setLoginid] = useState("");
  const [name, setName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [line_1, setLine_1] = useState("");
  const [line_2, setLine_2] = useState("");
  const [line_3, setLine_3] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [donationTypes, setDonationTypes] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/role/getAllMemberRoles`);
        const result = await response.json();
        setDonationTypes(result.data.roles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (eventId) {
      const fetchData = async () => {
        const token = localStorage.getItem("token");
        const parseToken = (token) || {};
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/users/getUser/${eventId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parseToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("User data fetched:", data); 
          const existingObject = data.data;

          // Set user details from the response
          setEmail(existingObject.email || "");
          setLoginid(existingObject.loginId || "");
          setName(existingObject.name || "");
          setPhonenumber(existingObject.phonenumber || "");
          
          // Set address fields
          setLine_1(existingObject.address?.line_1 || ""); // Assuming these fields exist
          setCity(existingObject.address?.city || "");
          setState(existingObject.address?.state || "");
          setPincode(existingObject.address?.pincode || "");
          setCountry(existingObject.address?.country || "");
          
          // Set role using the role ID from the user data
          setSelectedRole(existingObject.memberRole || "");

          setIsLoading(false);
        } else {
          const data = await response.json();
          console.error(data.errorMessage);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [eventId]);

  const handleSignup = async () => {
    const token = localStorage.getItem("token");
    const parseToken = (token) || {};
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/users/updateUser/${eventId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify({
          name,
          phonenumber,
          address: {
            line_1,
            city,
            state,
            pincode,
            country,
          },
          loginId,
          email,
          memberRole: selectedRole, 
        }),
      }
    );

    if (response.ok) {
      toast.success("Update successfully", {
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
    setSelectedRole(e.target.value);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Section>
        <div className="signupPage">
          <div className="signupFormMain">
            <h2 className={`${styles.formHeaderext}`}>
              Enter committee member details!
            </h2>
            <form>
              <div className="formMainDiv">
                {/* User input fields */}
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
                <div className="label-form role">
                  <label htmlFor="role">Role</label><br />
                  <select
                    name="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="border border-gray-950 p-1 py-3 w-full"
                  >
                    <option value="" disabled>Select Role Type</option>
                    {donationTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.nameHindi}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="label-form">
                  <label htmlFor="line_1">Address</label><br />
                  <input
                    type="text"
                    id="line_1"
                    value={line_1}
                    onChange={(e) => setLine_1(e.target.value)}
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
              </div>

              <div className="d-flex">
                <div className="submitEvent addDonarSubmitBtnMain">
                  <button
                    className="addDonarSubmitBtn"
                    type="button"
                    onClick={handleSignup}
                  >
                    Update member
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
