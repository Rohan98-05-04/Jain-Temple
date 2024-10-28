"use client";
import Link from 'next/link';
import Logo from "../Logo";
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './SidebarNavigation.module.css';
import { BsSpeedometer2 } from "react-icons/bs";
import { GiExpense } from "react-icons/gi";
import { FaDonate } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaUserShield } from "react-icons/fa";
import Cookies from 'js-cookie';

const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEcommerceOpen, setIsEcommerceOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleEcommerceDropdown = () => {
    setIsEcommerceOpen(!isEcommerceOpen);
  };

  const iconStyle = { fontSize: '24px' };

  const handleSignOut = () => {
    Cookies.remove('token'); // Remove token from cookies
    router.push('/login');
  };

  const isMasterActive = [
    '/masters/typedonation',
    '/masters/role',
    '/masters/bolihead'
  ].includes(router.pathname);

  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      <aside id="default-sidebar" className={`fixed top-0 left-0 z-40 w-80 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 sm:hidden"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9.293l4.146-4.146a1 1 0 011.415 1.415L11.414 10l4.146 4.146a1 1 0 01-1.415 1.415L10 11.414l-4.146 4.146a1 1 0 01-1.415-1.415L8.586 10 4.44 5.854a1 1 0 011.415-1.415L10 9.293z" clipRule="evenodd" />
            </svg>
          </button>

          <div className={styles['logo-container']}>
            <Logo />
            <div className={styles['logo-explain']}>Jain Temple</div>
          </div>

          <ul className="space-y-2 font-medium text-lg">
            {[{
              href: '/dashboard',
              label: 'Dashboard',
              icon: (props) => <BsSpeedometer2 {...props} style={iconStyle} />
            },
            {
              href: '/mandir-users',
              label: 'Mandir Donor',
              icon: (props) => <FaUserShield {...props} style={iconStyle} />
            },
            {
              href: '/donation',
              label: 'Donation',
              icon: (props) => <FaDonate {...props} style={iconStyle} />
            },
            {
              href: '/expenses',
              label: 'Expenses',
              icon: (props) => <GiExpense {...props} style={iconStyle} />
            },
            {
              href: '/event',
              label: 'Event',
              icon: (props) => <MdOutlineEventNote {...props} style={iconStyle} />
            },
            {
              href: '/boli',
              label: 'Boli',
              icon: (props) => <MdOutlineEventNote {...props} style={iconStyle} />
            },
            {
              href: '/committee-members',
              label: 'Committee members',
              icon: (props) => <IoIosPeople {...props} style={iconStyle} />
            },
            {
              href: '/videos',
              label: 'Videos Links',
              icon: (props) => <IoIosPeople {...props} style={iconStyle} />
            },
            {
              href: '/gallery',
              label: 'Gallery',
              icon: (props) => <IoIosPeople {...props} style={iconStyle} />
            },
            {
              href: '/masters',
              label: 'Master',
              icon: (props) => <IoIosPeople {...props} style={iconStyle} />
            },
            ].map(({ href, label, icon: Icon, onClick }) => (
              <li key={href}>
                <Link href={href} passHref onClick={onClick}>
                  <div className={`flex items-center p-2 rounded-lg hover:text-white hover:bg-orange-400 dark:hover:bg-gray-700 group ${router.pathname === href ? styles.active : 'text-gray-900'}`}>
                    <Icon />
                    <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
                  </div>
                </Link>
              </li>
            ))}

            <div onClick={handleSignOut}  className="flex items-center p-2 rounded-lg hover:text-white hover:bg-orange-400 dark:hover:bg-gray-700">
              <button className="flex items-center">
                <IoIosPeople style={iconStyle} />
                <span className="ml-4">Sign Out</span>
              </button>
            </div>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
