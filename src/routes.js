import { IoGridOutline, IoHomeOutline } from "react-icons/io5";
import { BsSpeedometer2 } from "react-icons/bs";
import { GiExpense } from "react-icons/gi";
import { FaDonate } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaUserShield } from "react-icons/fa";

const iconStyle = { fontSize: '24px' }; // Adjust size as needed

export default [
    {
        to: '/dashboard',
        name: 'Dashboard',
        Icon: (props) => <BsSpeedometer2 {...props} style={iconStyle} />
    },
    {
        to: '/mandir-users',
        name: 'Mandir users',
        Icon: (props) => <FaUserShield {...props} style={iconStyle} />
    },
    {
        to: '/donation',
        name: 'Donation',
        Icon: (props) => <FaDonate {...props} style={iconStyle} />
    },
    {
        to: '/expenses',
        name: 'Expenses',
        Icon: (props) => <GiExpense {...props} style={iconStyle} />
    },
    {
        to: '/event',
        name: 'Event',
        Icon: (props) => <MdOutlineEventNote {...props} style={iconStyle} />
    },
    {
        to: '/committee-members',
        name: 'Committee members',
        Icon: (props) => <IoIosPeople {...props} style={iconStyle} />
    },
];
