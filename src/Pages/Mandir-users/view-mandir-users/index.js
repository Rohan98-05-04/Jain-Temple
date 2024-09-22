import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../../utils/config';
import { useRouter } from 'next/router';
import Section from '@aio/components/Section';
import styles from "../mandir-users.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner'; 



const ViewMandirUser = () => {

    const [donarData, setDonarData] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()
    const  slug  = router.query;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };


    useEffect(() => {
        if (slug.slug) {
        let jsonString = [];
        const token = localStorage.getItem('token');
        const parseToken = JSON.parse(token) || {};
        setIsLoading(true);
        
        const fetchData = async () => {
            const response = await fetch(`${API_BASE_URL}/donor/getdonor/${slug.slug}`, {
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
      }, [slug]);

  return (
   <>
   <Section>
   {isLoading &&    <Spinner/>  }
   <div className="DonarViewMain">
        <h2 className='text-center'>Donar</h2>
        <div className="DonarViewcard">
            <div className="card-body">
                <i className="fa fa-pen fa-xs edit"></i>
                <table>
                    <tbody>
                    {donarData?.firstName && (

                        <tr>
                            <td>First name</td>
                            <td>:</td>
                            <td>{donarData?.firstName}</td>
                        </tr>
                    )}
                        {donarData?.lastName && (

                        <tr>
                            <td>Last name</td>
                            <td>:</td>
                            <td>{donarData?.lastName}</td>
                        </tr>
                        )}
                        {donarData?.email && (

                        <tr>
                            <td>Email</td>
                            <td>:</td>
                            <td>{donarData?.email}</td>
                        </tr>
                        )}
                        {donarData?.bloodGroup && (

                        <tr>
                            <td>Blood group</td>
                            <td>:</td>
                            <td>{donarData?.bloodGroup}</td>
                        </tr>
                        )}
                        {donarData?.occupation && (

                        <tr>
                            <td>Occupation</td>
                            <td>:</td>
                            <td>{donarData?.occupation}</td>
                        </tr>
                        )}
                        {donarData?.phoneNumbers[0]?.Phonenumber1 && (

                        <tr>
                            <td>Phone Number 1</td>
                            <td>:</td>
                            <td>{donarData?.phoneNumbers[0]?.Phonenumber1}</td>
                        </tr>
                        )}
                        {donarData?.phoneNumbers[0]?.Phonenumber2 && (

                        <tr>
                            <td>Phone Number 2</td>
                            <td>:</td>
                            <td>{donarData?.phoneNumbers[0]?.Phonenumber2}</td>
                        </tr>
                        )}
                        {donarData?.dob && (

                        <tr>
                            <td>dob</td>
                            <td>:</td>
                            <td>{donarData?.dob ? formatDate(donarData.dob) : '-'}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {donarData?.members && donarData?.members.length > 0 && (

        <div className="DonarViewcard">
            <div className="card-body">
                <i className="fa fa-pen fa-xs edit"></i>
                    {donarData?.members.map((member, index) => (
  <div key={index} className={`${styles.memberContainer} border p-2`}>
    <h2>Member {index + 1}</h2>
                <table>
                    <tbody>
                    {member?.firstName && (
                        <tr>
                            <td>First name</td>
                            <td>:</td>
                            <td>{member?.firstName}</td>
                        </tr>
                    )}
                    {member?.lastName && (
                        
                        <tr>
                            <td>Last name</td>
                            <td>:</td>
                            <td>{member?.lastName}</td>
                        </tr>
                            )}
                   {member?.relation && (
                       
                       <tr>
                            <td>Relation</td>
                            <td>:</td>
                            <td>{member?.relation}</td>
                        </tr>
                            )}
                   {member?.email && (
                       
                       <tr>
                            <td>Email</td>
                            <td>:</td>
                            <td>{member?.email}</td>
                        </tr>
                            )}
                    {member?.bloodGroup && (
                        
                        <tr>
                            <td>Blood group</td>
                            <td>:</td>
                            <td>{member?.bloodGroup}</td>
                        </tr>
                            )}
                        {member?.occupation && (
                            
                            <tr>
                            <td>Occupation</td>
                            <td>:</td>
                            <td>{member?.occupation}</td>
                        </tr>
                            )}
                        {member?.dob && (
                            
                            <tr>
                            <td>dob</td>
                            <td>:</td>
                            <td>{member?.dob ? formatDate(donarData.dob) : '-'}</td>
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
