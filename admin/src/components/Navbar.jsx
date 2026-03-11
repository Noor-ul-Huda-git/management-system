// import React from 'react'
// import{navbarStyles as ns} from '../assets/frontend/dummyStyles';
// import logoImg from '../assets/logo.png';
// import {Link} from "react-router-dom";
// const Navbar =() =>{
//     const[open,setOpen]= useState(false);
//     const navInnerRef=useRef(null);
//     const indicatorRef=useRef(null);
//     const location=useLocation(null);
//     const navigate=useNavigate(null);
//   return(
//    <header className={ns.header}>
//     <nav className={ns.navContainer}>
//         <div className={ns.flexContainer}>
//             <div className={ns.logoContainer}>
//                 <img src={logoImg} alt="logo" className={ns.logoImage}/>
//                 <Link to ='/'>
//                 <div className={ns.logoLink}>MediCare</div>
//                 <div className={ns.logoSubset}>HealthCare Soluution</div>

//                 </Link>
//                 {/* Center navigation */}
//                 <div className={ns.centerNavContainer}>
//                     <div className={ns.glowEffect}>
//                         <div className={ns.centerNavInner}>
//                             <div ref={navInnerRef} tabIndex={0} className={ns.centerNavScrollContainer}
//                             style={{
//                                 WebKitOverflowScrolling:"touch",
//                             }}>
//                                  <CenterNavItem
//                     to="/h"
//                     label="Dashboard"
//                     icon={<Home size={16} />}
//                   />
//                   <CenterNavItem
//                     to="/add"
//                     label="Add Doctor"
//                     icon={<UserPlus size={16} />}
//                   />
//                   <CenterNavItem
//                     to="/list"
//                     label="List Doctors"
//                     icon={<Users size={16} />}
//                   />
//                   <CenterNavItem
//                     to="/appointments"
//                     label="Appointments"
//                     icon={<Calendar size={16} />}
//                   />
//                   <CenterNavItem
//                     to="/service-dashboard"
//                     label="Service Dashboard"
//                     icon={<Grid size={16} />}
//                   />
//                   <CenterNavItem
//                     to="/add-service"
//                     label="Add Service"
//                     icon={<PlusSquare size={16} />}
//                   />
//                   <CenterNavItem
//                     to="/list-service"
//                     label="List Services"
//                     icon={<List size={16} />}
//                   />
//                   <CenterNavItem
//                     to="/service-appointments"
//                     label="Service Appointments"
//                     icon={<Calendar size={16} />}
//                   />
//                 </div>

//                             </div>
                            
//                         </div>
//                     </div>

//                 </div>
//             </div>
       
//     </nav>

//    </header>
//   );
// };
// export default Navbar
// function CenterNavItem({ to,icon,label}){
//     return(
//         <NavLink to={to} end className={({isActive})=>
//             `nav-item ${isActive ? "active": ""}
//         ${ns.centerNavItemBase} ${ isActive ? ns.centerNavItem: ns.centerNavItemInactive}`  
//         }>
//             <span>{icon}</span>
//             <span className="font-medium">{label}</span>

//         </NavLink>
//     )
// }


import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { navbarStyles as ns } from "../assets/frontend/dummyStyles";
import logoImg from "../assets/frontend/logo.png";

import {
  Home,
  UserPlus,
  Users,
  Calendar,
  Grid,
  PlusSquare,
  List,
  Menu,
  X
} from "lucide-react";

import { useClerk, useAuth, useUser } from "@clerk/react";

const Navbar = () => {

  const [open, setOpen] = useState(false);

  const navInnerRef = useRef(null);
  const indicatorRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const clerk = useClerk();

  const { getToken, isLoaded: authLoaded } = useAuth();

  const { isSignedIn, user, isLoaded: userLoaded } = useUser();

  const moveIndicator = useCallback(() => {

    const container = navInnerRef.current;
    const ind = indicatorRef.current;

    if (!container || !ind) return;

    const active = container.querySelector(".nav-item.active");

    if (!active) {
      ind.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const left = activeRect.left - containerRect.left + container.scrollLeft;
    const width = activeRect.width;

    ind.style.transform = `translateX(${left}px)`;
    ind.style.width = `${width}px`;
    ind.style.opacity = "1";

  }, []);

  useLayoutEffect(() => {

    moveIndicator();

    const t = setTimeout(() => {
      moveIndicator();
    }, 120);

    return () => clearTimeout(t);

  }, [location.pathname, moveIndicator]);

  useEffect(() => {

    const container = navInnerRef.current;

    if (!container) return;

    const onScroll = () => moveIndicator();

    container.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => moveIndicator());

    ro.observe(container);

    window.addEventListener("resize", moveIndicator);

    return () => {

      container.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", moveIndicator);

    };

  }, [moveIndicator]);

  useEffect(() => {

    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [open]);

  useEffect(() => {

    let mounted = true;

    const storeToken = async () => {

      if (!authLoaded || !userLoaded) return;

      if (!isSignedIn) {

        localStorage.removeItem("clerk_token");
        return;

      }

      try {

        const token = await getToken();

        if (!mounted) return;

        if (token) localStorage.setItem("clerk_token", token);

      } catch (err) {

        console.warn("could not retrieve clerk token", err);

      }

    };

    storeToken();

    return () => {
      mounted = false;
    };

  }, [isSignedIn, authLoaded, userLoaded, getToken]);

  const handleOpenSignIn = () => {

    if (!clerk?.openSignIn) return;

    clerk.openSignIn();

    navigate("/h");

  };

  const handleSignOut = async () => {

    try {

      await clerk.signOut();

    } catch (err) {

      console.error("Sign out failed", err);

    }

    localStorage.removeItem("clerk_token");

    navigate("/");

  };

  return (

    <header className={ns.header}>
      <nav className={ns.navContainer}>

        <div className={ns.flexContainer}>

          <div className={ns.logoContainer}>

            <img src={logoImg} alt="logo" className={ns.logoImage} />

            <Link to="/">
              <div className={ns.logoLink}>MediCare</div>
              <div className={ns.logoSubset}>HealthCare Solution</div>
            </Link>

          </div>

        </div>

      </nav>
    </header>

  );

};

export default Navbar;
