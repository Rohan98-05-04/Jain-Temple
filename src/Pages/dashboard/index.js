import { useEffect, useRef, useState } from "react";
import Card from "@aio/components/Card";
import Modal from "@aio/components/Modal";
import styles from "./Home.module.css";
import { MdOutlinePayment } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { GiProfit } from "react-icons/gi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import DoughnutChartExample from "../../components/DoughnutChartExample";
import HeaderSection from "@aio/components/HeaderSection";
import DataCard from "@aio/components/DataCard";
import { SlCalender } from "react-icons/sl";
import ActionButton from "@aio/components/ActionButton";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Section from "@aio/components/Section";
import { API_BASE_URL } from "../../../utils/config";
import Table from "@aio/components/Table";
import Spinner from '../../components/Spinner'; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import BillingHistory from "../../components/BillingHistory";
import Paragraph from "../../components/Paragraph";
import BarChartExample from "../../components/BarChartExample";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

export default function Dashboard() {
  const [modal, setModal] = useState(false);
  const [todaysBalance, setTodaysBalance] = useState();
  const [todaysDonar, setTodaysDonar] = useState();
  const [todaysExpense, setTodaysExpense] = useState();
  const [todaysDonation, setTodaysDonation] = useState();
  const [todaysCashDonation, setTodaysCashDonation] = useState();
  const [todaysCashBalance, setTodaysCashBalance] = useState();
  const [todaysOnlineBalance, setTodaysOnlineBalance] = useState();
  const [totalCashDonation, setTotalCashDonation] = useState();
  const [todaysOnlineDonation, setTodaysOnlineDonation] = useState();
  const [totalOnlineDonation, setTotalOnlineDonation] = useState();
  const [todaysChequeDonation, setTodaysChequeDonation] = useState();
  const [totalCashBalance, settotalCashBalance] = useState();
  const [totaOnlineBalance, settotaOnlineBalance] = useState();
  const [todaysPendingDonation, setTodaysPendingDonation] = useState();
  const [totalOnlineBalance, settotalOnlineBalance] = useState();
  const [totalPendingDonation, setTotalPendingDonation] = useState();
  const [totalExpense, setTotalExpense] = useState();
  const [totalDonation, setTotalDonation] = useState();
  const [totalBalance, setTotalBalance] = useState();
  const [totalDonor, setTotalDonor] = useState();
  const [donationData, setDonationData] = useState([]);
  const [topDonarData, setTopDonarData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(15);
  const [donationMonthlyData, setDonationMonthlyData] = useState([]);
  const [expenseMonthlyData, setExpenseMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    //alert('closing');
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  }
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Donation",
        font: {
          size: 18, 
          weight: 'bold', 
        },
        textAlign: 'left',
      },
    },
  };
  const expenseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Expenses",
        font: {
          size: 18, 
          weight: 'bold', 
        },
        textAlign: 'left',
      },
    },
  };
  const donationMonths = donationMonthlyData?.map(item => item.monthName);
  const donationAmounts = donationMonthlyData?.map(item => item.donation);
  
  const expenseMonths = expenseMonthlyData?.map(item => item.monthName);
  const expenseAmounts = expenseMonthlyData?.map(item => item.donation);
   
    const data = {
      labels: donationMonths,
      datasets: [
        
        {
          label: "Donation",
          // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
          data: donationAmounts,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
    const monthlyExpensedata = {
      labels: expenseMonths,
      datasets: [
        {
          label: "Expense",
          data: expenseAmounts,
          // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      
      ],
    };
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};

    const fetchData = async () => {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/donation/totaldayBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodaysBalance(data.data);
        setIsLoading(false);
        
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByDonar = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donor/getDayDonor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysDonar(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByexpense = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/expense/getDayExpense`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysExpense(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/todayDayDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByCashDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/todayCashDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysCashDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByOnlineBalance = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/todayOnlineBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysOnlineBalance(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByCashBalance = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/todayCashBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysCashBalance(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalCashDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/totalCashDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalCashDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalOnlineDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/totalOnlineDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalOnlineDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalCashBalance = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/totalCashBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        settotalCashBalance(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalOnlineBalance = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/totalOnlineBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        settotalOnlineBalance(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalPendingDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/totalPendingDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalPendingDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByOnlineDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/todayOnlineDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysOnlineDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByChequeDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/todayCashDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysChequeDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByPendingDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/todayPendingDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysPendingDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/totalDonation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalDonation(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalDonor = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donor/getDonorCount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalDonor(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        
        setIsLoading(false);
      }
    };
    const fetchDataByTotalExpense = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/expense/getTotalExpense`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalExpense(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
        
      }
    };
    const fetchDataByTotalbalance = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/totalBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalBalance(data.data);
        setIsLoading(false);
      } else {
        const data = await response.json();
        
        setIsLoading(false);
      }
    };
    
    const fetchLatestDonation = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/donation/getallDonation?page=${activePage}&size=${size}&sort=donationAmount,desc`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parseToken}`,
          
        },
        body: JSON.stringify(),
      });
      
      if (response.ok) {
        
        const data = await response.json();
        setDonationData(data.data.data);
        
        setIsLoading(false);
      } else {
        const data = await response.json();
        setIsLoading(false);
      }
    }
    // const fetchTopDonation = async () => {
      //   const response = await fetch(`${API_BASE_URL}/donation/top15MaxDonar`, {
        //     method: 'GET',
        //     headers: {
          //       'Content-Type': 'application/json',
          //       'Authorization': `Bearer ${parseToken}`,
          
          //     },
          //     body: JSON.stringify(),
          //   });
          
          //   if (response.ok) {
            
            //     const data = await response.json();
            //     // setTopDonarData(data.data.data);
            
            //   } else {
              //     const data = await response.json();
              //     console.error(data.errorMessage);
              //     alert(data.errorMessage);
              //   }
              //   }
              const fetchDonationAndExpenseMonthly = async () => {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/donation/expense-and-donaion`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${parseToken}`,
                    
                  },
                  body: JSON.stringify({"year":2023}),
                });
                
                if (response.ok) {
                  
                  const data = await response.json();
                  console.log(data)
                  setDonationMonthlyData(data.data.donation)
                  setExpenseMonthlyData(data.data.expense)
                  setIsLoading(false);
                } else {
                  const data = await response.json();
                  setIsLoading(false);
                }
              }
              
              fetchDonationAndExpenseMonthly();
              fetchData();
              fetchDataByDonar();
              // fetchTopDonation();
              fetchDataByCashDonation();
              fetchDataByTotalCashDonation();
              fetchDataByTotalOnlineDonation();
              fetchDataByTotalCashBalance();
              fetchDataByTotalPendingDonation();
              fetchDataByTotalOnlineBalance();
              fetchDataByCashBalance();
              fetchDataByOnlineDonation();
              fetchDataByOnlineBalance();
              fetchDataByChequeDonation();
      fetchDataByexpense();
      fetchDataByDonation();
      fetchDataByPendingDonation();
      fetchDataByTotalDonation();
      fetchDataByTotalDonor();
      fetchDataByTotalExpense();
      fetchDataByTotalbalance();
      fetchLatestDonation();
  }, []);
  const handleSubmit = () => {
    alert('Submit is working..!');
    handleClose();
  }

  return (
    <>
 {isLoading &&    <Spinner/>  }
      <HeaderSection
        heading={"Dashboard"}
        subHeading={"Welcome"}
        // rightItem={() => (
        //   <ActionButton
        //     onClick={() => setModal(true)}
        //     Icon={AiOutlinePlusCircle}
        //     label="Add New User"
        //   />
        // )}
      />

      <Section>
        <h3>Today&apos;s data</h3>

        <Link href={"/event-data"} className={styles.eventDataBtn}>Events amount</Link>
      <div className={styles.container}>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Donation</p>
            <p className={styles.boxAmount}>{todaysDonation} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <MdOutlinePayment size={30} />
          </div>
        </div>
        
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Donar</p>
            <p className={styles.boxAmount}>{todaysDonar}</p>
          </div>
          <div className={styles.iconContainer}>
            <BsFillPersonPlusFill size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Expenses</p>
            <p className={styles.boxAmount}>{todaysExpense} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <GiExpense size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Balance</p>
            <p className={styles.boxAmount}>{todaysBalance} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <GiProfit size={30} />
          </div>
        </div>
      </div>
      </Section>
      <div className={styles.hrMain}>
        
      <hr className={styles.hr}/>
      </div>
      <Section>
      <div className={styles.container}>
        
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Cash Donation</p>
            <p className={styles.boxAmount}>{todaysCashDonation} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <GiProfit size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Online Donation</p>
            <p className={styles.boxAmount}>{todaysOnlineDonation} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <GiProfit size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Cash Balance</p>
            <p className={styles.boxAmount}>{todaysCashBalance} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <MdOutlinePayment size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Online Balance</p>
            <p className={styles.boxAmount}>{todaysOnlineBalance} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <MdOutlinePayment size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Today&apos;s Pending Donation</p>
            <p className={styles.boxAmount}>{todaysPendingDonation} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <MdOutlinePayment size={30} />
          </div>
        </div>
      </div>
      </Section>
<hr />
      <Section>
      <h3>Monthly donation and expenses</h3>
      <div className={styles.ChartMain}>

<div className={styles.donationChartMain}>
  <Line data={data} options={options} />
</div>
<div className={styles.donationChartMain}>
  <Line data={monthlyExpensedata} options={expenseOptions} />
</div>

</div>
      </Section>
    
<hr />
      <Section>
      <h3>Total data</h3>

      <div className={styles.container}>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Total Donation</p>
            <p className={styles.boxAmount}>{totalDonation} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <MdOutlinePayment size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Total Donor</p>
            <p className={styles.boxAmount}>{totalDonor}</p>
          </div>
          <div className={styles.iconContainer}>
            <BsFillPersonPlusFill size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Total Expenses</p>
            <p className={styles.boxAmount}>{totalExpense} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <GiExpense size={30} />
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <p className={styles.boxHead}>Total Balance</p>
            <p className={styles.boxAmount}>{totalBalance} Rs.</p>
          </div>
          <div className={styles.iconContainer}>
            <GiProfit size={30} />
          </div>
        </div>
      </div>
      </Section>
      <div className={styles.hrMain}>
        
        <hr className={styles.hr}/>
        </div>
        <Section>
        <div className={styles.container}>
          
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Cash Donation</p>
              <p className={styles.boxAmount}>{totalCashDonation} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Online Donation</p>
              <p className={styles.boxAmount}>{totalOnlineDonation} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Cash Balance</p>
              <p className={styles.boxAmount}>{totalCashBalance} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Online Balance</p>
              <p className={styles.boxAmount}>{totalOnlineBalance} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Pending Balance</p>
              <p className={styles.boxAmount}>{totalPendingDonation} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
        </div>
        </Section>
<hr />
<Section >
<h3>Top donation</h3>
<table className="table">
  <thead>
    <tr>
    <th scope="col">Donor Name</th>
          <th scope="col">Donor Number</th>
          <th scope="col">Payment Type</th>
          <th scope="col">Donation Amount</th>
    </tr>
  </thead>
  <tbody>
  {donationData.map((donation, index) => (
              <tr key={index}>
                <td>{donation.donarId.firstName}</td>
                <td>{donation.donarId.phoneNumbers[0].Phonenumber1}</td>
                <td>{donation.donationMode}</td>
                <td>{donation.donationAmount}</td>
                
              </tr>
            ))}
  
  </tbody>
</table>

    </Section>
      {/* <BillingHistory />

      <Modal
        isOpen={modal}
        onClose={handleClose}
        heading={"AIO Dashboard"}
        positiveText={"Save Changes"}
        negativeText={"Cancel"}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      >
        <p>Welcome to aio dashboard</p>
      </Modal> */}
    </>
  );
}
