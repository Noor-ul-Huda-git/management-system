import React, { useEffect } from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import axios from "axios";
const API_BASE="http://localhost:4000";
const VerifyPaymentPage=()=>{
    const location =useLocation();
    const navigate = useNavigate();
    useEffect(()=>{
        let cancelled=false;
        const VerifyPayment= async()=>{
            const params =new URLSearchParams(location.search || "");
            const sessionId = params.get("session_id");
            if(location.pathname==='/appointment/cancel'){
                navigate("/appointments ? payment_status=Cancelled",{replace:true});
                return;
            }
            if(!sessionId){
                if(!cancelled)
                    navigate("/appointments ? payment_status=Failed",{replace:true});
                return;
            }
            try{
                const res=await axios.get(`${API_BASE}/api/aapointments/confirm`,{
                    timeout:15000,
                });
                if(cancelled) return;
                if(res ?.date?.success){
                    navigate("/appointments?payment_statusPaid",{replace:true});
                } else{
                    navigate("/appointments?payment_statusFailed",{replace:true});
                }

            }
            catch(error){
              console.error("payment verification failed",error);
              if(!cancelled)
                 navigate("/appointments?payment_statusFailed",{replace:true});
            }
        };
        VerifyPayment();
        return()=>{
            cancelled=true;
        };
    } ,[location,navigate]);
    return
       null;
    
}
export default VerifyPaymentPage;