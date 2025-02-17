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
import Spinner from "../../components/Spinner";

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
import "react-toastify/dist/ReactToastify.css";
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
  const [allData, setData] = useState();
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
  };
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
          weight: "bold",
        },
        textAlign: "left",
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
          weight: "bold",
        },
        textAlign: "left",
      },
    },
  };
  const donationMonths = donationMonthlyData?.donation?.map((item) => item.monthName);
  const donationAmounts = donationMonthlyData?.donation?.map((item) => item.donation);

  const expenseMonths = expenseMonthlyData?.expense?.map((item) => item.monthName);
  const expenseAmounts = expenseMonthlyData?.expense?.map((item) => item.expense);

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
    const parseToken = token || {};
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/users/getDashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify(),
      });

      if (response.ok) {
        const data = await response.json();
        setData(data.data);
        console.log("getallExpCategory", data.data);
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const parseToken = token || {};
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/donationDetail/totalMothBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify(),
      });

      if (response.ok) {
        const data = await response.json();
        setDonationMonthlyData(data.data);
        setExpenseMonthlyData(data.data);
      } else {
        const data = await response.json();
        console.error(data.errorMessage);
        alert(data.errorMessage);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = () => {
    alert("Submit is working..!");
    handleClose();
  };

  return (
    <>
      {isLoading && <Spinner />}
      <HeaderSection
        heading={"Dashboard"}
        subHeading={"Welcome"}
      />

      <Section>
        <h3>Today&apos;s data</h3>

        {/* <Link href={"/event-data"} className={styles.eventDataBtn}>
          Events amount
        </Link> */}
        <div className={styles.container}>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total Donation</p>
              <p className={styles.boxAmount}>{allData?.totalDonations} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>

          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Today&apos;s Donor</p>
              <p className={styles.boxAmount}>{allData?.todaysDonors}</p>
            </div>
            <div className={styles.iconContainer}>
              <BsFillPersonPlusFill size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total Expenses</p>
              <p className={styles.boxAmount}>{allData?.totalExpenses} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <GiExpense size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Today&apos;s Balance</p>
              <p className={styles.boxAmount}>{allData?.todaysBalance} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
        </div>
      </Section>
      <div className={styles.hrMain}>
        <hr className={styles.hr} />
      </div>
      <Section>
        <div className={styles.container}>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Today&apos;s Cash Donation</p>
              <p className={styles.boxAmount}>
                {allData?.todaysCashDonations} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Today&apos;s Online Donation</p>
              <p className={styles.boxAmount}>
                {allData?.todaysOnlineDonations} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Today&apos;s Cheque Donation</p>
              <p className={styles.boxAmount}>
                {allData?.todaysChequeDonations} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Today&apos;s Item Donation</p>
              <p className={styles.boxAmount}>{allData?.todaysItemDonations}</p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Today&apos;s Pending Donation</p>
              <p className={styles.boxAmount}>
                {allData?.todaysPendingAmount} Rs.
              </p>
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
              <p className={styles.boxAmount}>
                {allData?.totalOverallDonations} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total Donor</p>
              <p className={styles.boxAmount}>{allData?.totalOverallDonors}</p>
            </div>
            <div className={styles.iconContainer}>
              <BsFillPersonPlusFill size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total Expenses</p>
              <p className={styles.boxAmount}>
                {allData?.totalOverallExpenses} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <GiExpense size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total Balance</p>
              <p className={styles.boxAmount}>{allData?.overallBalance} Rs.</p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
        </div>
      </Section>
      <div className={styles.hrMain}>
        <hr className={styles.hr} />
      </div>
      <Section>
        <div className={styles.container}>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Cash Donation</p>
              <p className={styles.boxAmount}>
                {allData?.totalOverallCash} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Online Donation</p>
              <p className={styles.boxAmount}>
                {allData?.totalOverallOnline} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <GiProfit size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Cheque Donation</p>
              <p className={styles.boxAmount}>
                {allData?.totalOverallCheque} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Items</p>
              <p className={styles.boxAmount}>{allData?.totalOverallItem}</p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <p className={styles.boxHead}>Total&apos;s Pending Balance</p>
              <p className={styles.boxAmount}>
                {allData?.totalOverallPendingAmount} Rs.
              </p>
            </div>
            <div className={styles.iconContainer}>
              <MdOutlinePayment size={30} />
            </div>
          </div>
        </div>
      </Section>
      <hr />
      <Section>
        <h3>Top donation</h3>
        <table className="min-w-full text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-nowrap border-b">Donor Name</th>
              <th className="py-2 px-4 text-nowrap border">Donor Number</th>
              <th className="py-2 px-4 text-nowrap border">Payment Type</th>
              <th className="py-2 px-4 text-nowrap border">Donation Amount</th>
            </tr>
          </thead>
          <tbody>
            {allData?.topDonations.map((donation, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{donation.fullname}</td>
                <td className="py-2 px-4 border">{donation.mobile}</td>
                <td className="py-2 px-4 border">{donation.paymentType}</td>
                <td className="py-2 px-4 border">{donation.totalAmount}</td>
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
