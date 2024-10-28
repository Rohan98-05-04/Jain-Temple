"use client";
import React, { useState } from "react";
// import { Sidebar, SidebarBody, SidebarLink } from "../AISidebar/aisidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GiExpense } from "react-icons/gi";
import { FaDonate } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaUserShield } from "react-icons/fa";
import Sidebar from "../SidebarNavigation";

const Layout = ({ children }) => {
  return (
    // <div className="flex">
    //   <SidebarDemo />
    //   <main className="transition-all duration-300">
    //     <Dashboard>{children}</Dashboard>
    //   </main>
    // </div>
    <>
    <Sidebar />
    <section className="content">
        {children}
      </section>
    </>
  );
};

export function SidebarDemo() {
  const iconStyle = { fontSize: '24px'};

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      href: '/mandir-users',
      label: 'Mandir users',
      icon: (<FaUserShield className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />)
    },
    {
      href: '/donation',
      label: 'Donation',
      icon: (<FaDonate className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />)
    },
    {
      href: '/expenses',
      label: 'Expenses',
      icon: (<GiExpense className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />)
    },
    {
      href: '/event',
      label: 'Event',
      icon: (<MdOutlineEventNote className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />)
    },
    {
      href: '/committee-members',
      label: 'Committee members',
      icon: ( <IoIosPeople className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> )
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  // return (
  //   <div className="flex flex-col bg-gray-100 dark:bg-neutral-800 border border-neutral-200 max-h-full dark:border-neutral-700">
  //     <Sidebar open={open} setOpen={setOpen}>
  //       <SidebarBody className="justify-between gap-10">
  //         <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
  //           {open ? <Logo /> : <LogoIcon />}
  //           <div className="mt-8 flex flex-col gap-2">
  //             {links.map((link, idx) => (
  //               <SidebarLink key={idx} link={link} />
  //             ))}
  //           </div>
  //         </div>
  //         <div>
  //           <SidebarLink
  //             link={{
  //               label: "Manu Arora",
  //               href: "#",
  //             }}
  //           />
  //         </div>
  //       </SidebarBody>
  //     </Sidebar>
  //   </div>
  // );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="../../img/Swastik-Logo.png" width="100px" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Jain Mandir
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="../../img/Swastik-Logo.png" width="50px" height="50px"  />
    </Link>
  );
};

const Dashboard = ({ children }) => {
  return (
    <div className="w-full p-2 md:p-10 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      {children}
    </div>
  );
};

export default Layout;
