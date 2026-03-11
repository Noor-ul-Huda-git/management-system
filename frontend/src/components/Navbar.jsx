import React, {useRef,useState} from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";

import{SignIn, useClerk} from "@clerk/clerk-react";
import { navbarStyles } from "../assets/frontend/dummyStyles.js";


import logo from "../assets/frontend/logo.png";

import { Menu, X, User, Key } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";


const STORAGE_KEY = "doctorToken_v1";
const Navbar=()=>{
    

  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const location = useLocation();
  const navRef = useRef(null);
  const clerk = useClerk();
  const navigate = useNavigate();
    const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];
    return(
       <>
       <div className={navbarStyles.navbarBorder}>
       </div>
       <nav className={`${navbarStyles.navbarContainer}
        ${showNavbar ? navbarStyles.navbarVisible:navbarStyles.navbarHidden}`}>
        <div className={navbarStyles.contentwrapper }>
            <div className={navbarStyles.flexContainer}>
                {/* Logo*/}
                <Link to='/' className={navbarStyles.logoLink}>
                <div className={navbarStyles.logoContainer}>
                    <div className={navbarStyles.logoImageWrapper}>
                        <img src={logo} alt="logo" className={navbarStyles.logoImage}/>
                    </div>
                </div>
                <div className={navbarStyles.logoTextContainer}>
                    <h1 className={navbarStyles.logotitle}>
                        MediCare
                    </h1>
                    <p className={navbarStyles.logoSubtitle}>
                        HealthCare Solutions
                    </p>
                </div>

                </Link>
                <div className={navbarStyles.desktopNav}>
                    <div className={navbarStyles.navItemsContainer}>
                        {navItems.map((item)=>{
                             const isActive=location.pathname===item.href;
                             return (
                                <Link key={item.href} to={item.href} className={`${navbarStyles.navbarItem}${
                                    isActive ?navbarStyles.navItemActive:navbarStyles.navItemInactive
                                }`}>
                                    {item.label}

                                </Link>
                             );
                             })}
                    </div>
                </div>
                {/* right side */}
                <div className={navbarStyles.rightContainer}>
                    <SignedOut>
                        <Link to='/doctor-admin/login' className={navbarStyles.doctorAdminButton}>
                        <User className={navbarStyles.doctorAdminIcon}/>
                        <span className={navbarStyles.doctorAdminText}>
                            Doctor Admin

                        </span>
                         </Link>
                         {/* patient login */}
                         <button onClick={()=> clerk.openSignIn()} className={navbarStyles.loginButton}>
                            <Key className={navbarStyles.loginIcon}/>

                            Login
                         </button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    {/* to toggle */}
                    <button
                     onClick={()=> setIsOpen(!isOpen)}
                      className={navbarStyles.mobileToggle}>
                        {isOpen ?(
                            <X className={navbarStyles.toggleIcon}/>
                        ):(
                            <Menu className={navbarStyles.toggleIcon}/>
                        )}
                    </button>

                </div>
            </div>
            {/* {mobile navigations} */}
            {isOpen &&(
                <div className={navbarStyles.MobileMenu}>
                    {navItems.map((item,idx)=>{
                        const isActive=location.pathname===item.href;
                        return(
                            <Link key={idx} to={item.href}
                            onClick={()=>setIsOpen(false)}
                            className={`${navbarStyles.mobileMenuItem}${isActive ?
                                navbarStyles.mobilemenuItemActive:navbarStyles.mobileMenuItemInactive
                            }`}>
                                {item.label}
                                 </Link>
                        );
                    })}
                    <SignedOut>
                        <Link to='/doctor-admin/login'
                         className={navbarStyles.mobileDoctoradminButton}
                         onClick={()=>setIsOpen(false)}>
                            Doctor Admin 
                        </Link>
                        <div className={navbarStyles.mobileLoginContainer}>
                            <button onClick={()=>{
                                setIsOpen(false);
                                clerk.openSignIn()
                            }} className={navbarStyles.mobileLoginButton}>
                                Login
                            </button>
                         </div>
                     </SignedOut>
                    </div>
            )}
         </div>
         <style>{navbarStyles.animationStyles}</style>
       </nav>
       </>
    )
}
export default Navbar