import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../../utils/config';
import { useRouter } from 'next/router';
import Section from '@aio/components/Section';
import styles from "../mandir-users.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner';



const ViewMandirUser = ({ DonorId }) => {

    const [donarData, setDonarData] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()
    const slug = router.query;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    console.log("DonorId", DonorId)


    useEffect(() => {
        if (DonorId) {
            let jsonString = [];
            const token = localStorage.getItem('token');
            const parseToken = (token) || {};
            setIsLoading(true);

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
                    setDonarData(data.data)
                    setIsLoading(false);

                } else {
                    const data = await response.json();
                    console.error(data.errorMessage);
                    alert(data.errorMessage);
                    setIsLoading(false);
                }
            }
            fetchData();
        }
    }, [DonorId]);

    return (
        <>
            <Section>
                {isLoading && <Spinner />}
                <div className="">
                    <h2 className='text-center mb-4'>Donor</h2>
                    <div className="DonarViewcard">
                        <div className="card-body">
                            <i className="fa fa-pen fa-xs edit"></i>
                            <table className="min-w-full border text-nowrap border-gray-300">
                                <tbody>
                                    {donarData?.firstName && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">First name</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.firstName}</td>
                                        </tr>
                                    )}
                                    {donarData?.lastName && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">Last name</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.lastName}</td>
                                        </tr>
                                    )}
                                    {donarData?.email && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">Email</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.email}</td>
                                        </tr>
                                    )}
                                    {donarData?.bloodGroup && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">Blood group</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.bloodGroup}</td>
                                        </tr>
                                    )}
                                    {donarData?.occupation && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">Occupation</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.occupation}</td>
                                        </tr>
                                    )}
                                    {donarData?.phoneNumbers[0]?.Phonenumber1 && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">Phone Number 1</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.phoneNumbers[0]?.Phonenumber1}</td>
                                        </tr>
                                    )}
                                    {donarData?.phoneNumbers[0]?.Phonenumber2 && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">Phone Number 2</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.phoneNumbers[0]?.Phonenumber2}</td>
                                        </tr>
                                    )}
                                    {donarData?.dob && (

                                        <tr>
                                            <th className="w-60 bg-gray-100 border border-gray-300 p-2">D.O.B.</th>
                                            <td className="border border-gray-300 text-nowrap p-2">{donarData?.dob ? formatDate(donarData.dob) : '-'}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {donarData?.members && donarData?.members.length > 0 && (

                        <div className="">
                            <div className="">
                                {donarData?.members.map((member, index) => (
                                    <div key={index} className={`my-4 border p-2`}>
                                        <h2>Member {index + 1}</h2>
                                        <table className="min-w-full border text-nowrap border-gray-300">
                                            <tbody>
                                                {member?.firstName && (
                                                    <tr>
                                                        <th className="w-60 bg-gray-100 border border-gray-300 p-2">First name</th>
                                                        <td className="border border-gray-300 text-nowrap p-2">{member?.firstName}</td>
                                                    </tr>
                                                )}
                                                {member?.lastName && (

                                                    <tr>
                                                        <th className="w-60 bg-gray-100 border border-gray-300 p-2">Last name</th>
                                                        <td className="border border-gray-300 text-nowrap p-2">{member?.lastName}</td>
                                                    </tr>
                                                )}
                                                {member?.relation && (

                                                    <tr>
                                                        <th className="w-60 bg-gray-100 border border-gray-300 p-2">Relation</th>
                                                        <td className="border border-gray-300 text-nowrap p-2">{member?.relation}</td>
                                                    </tr>
                                                )}
                                                {member?.email && (

                                                    <tr>
                                                        <th className="w-60 bg-gray-100 border border-gray-300 p-2">Email</th>
                                                        <td className="border border-gray-300 text-nowrap p-2">{member?.email}</td>
                                                    </tr>
                                                )}
                                                {member?.bloodGroup && (

                                                    <tr>
                                                        <th className="w-60 bg-gray-100 border border-gray-300 p-2">Blood group</th>
                                                        <td className="border border-gray-300 text-nowrap p-2">{member?.bloodGroup}</td>
                                                    </tr>
                                                )}
                                                {member?.occupation && (

                                                    <tr>
                                                        <th className="w-60 bg-gray-100 border border-gray-300 p-2">Occupation</th>
                                                        <td className="border border-gray-300 text-nowrap p-2">{member?.occupation}</td>
                                                    </tr>
                                                )}
                                                {member?.dob && (

                                                    <tr>
                                                        <th className="w-60 bg-gray-100 border border-gray-300 p-2">dob</th>
                                                        <td className="border border-gray-300 text-nowrap p-2">{member?.dob ? formatDate(donarData.dob) : '-'}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>

                    )}
                </div>
            </Section>
        </>
    );
};

export default ViewMandirUser;
