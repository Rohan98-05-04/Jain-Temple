import Logo from "../Logo";
import styles from "./SidebarNavigation.module.css";
import Link from "next/link";
import routes from "../../routes";
import { useRouter } from "next/router";
import { TbLogout } from "react-icons/tb";
import { BiChevronLeft } from "react-icons/bi";
import { useState } from "react";
import Cookies from "js-cookie";

const SidebarNavigation = ({
  sidebarMenuActive,
  toggleSidebarMenu
}) => {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

// Function to toggle submenu visibility
const toggleSubMenu = (index) => {
  setActiveSubMenu(activeSubMenu === index ? null : index);
};

const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    Cookies.remove("token");
    router.push('/login')
  }
}
  return (
    <section className={`${styles.container} ${sidebarMenuActive ? styles['active'] : ''}`}>
      <button className={styles["sidebar-close-btn"]} onClick={toggleSidebarMenu}>
        x
      </button>
      <div className={styles['logo-container']}>
        <Logo />
        <div className={styles['logo-explain']}>Jain Temple</div>
      </div>
      <ul className={styles["sidebar-container"]}>
      {routes.map((page, index) => {
        const isActive = router.asPath === page.to || router.asPath.startsWith(`${page.to}/`);
        
        return (
          <li
            key={index}
            className={`${styles["sidebar-menu-item"]} ${isActive ? styles['active'] : ''}`}
          >
            <Link href={page.to}>
              <page.Icon />
              <span>{page.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>

      <ul className={styles["sidebar-footer"]}>
        {/* <button onClick={toggleSidebarMenu}>close</button> */}
          <li onClick={logout} className={styles["footer-item"]}> 
            <TbLogout />
            <span>Logout</span>
          </li>
          
      </ul>
    </section>
  );
};

export default SidebarNavigation;
