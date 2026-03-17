import React from 'react'
import {bannerStyles} from '../assets/frontend/dummyStyles'
import {
    Clock,Ribbon,ShieldUser,Star,Stethoscope,Users} from "lucide-react";
    import {useNavigate} from "react-router-dom";
    import banner from "../assets/frontend/dummyStyles";

const Banner=()=>{
    const navigate=useNavigate();
    return(
        <div classname={bannerStyles.bannerContainer}>
            <div classname={bannerStyles.mainContainer}>
                <div classname={bannerStyles.borderOutline}>
                    <div classname={bannerStyles.outerAnimatedButton}>

                    </div>
                    <div classname={bannerStyles.innerWhiteBorder}>

                    </div>

                </div>
                <div classname={bannerStyles.contentContainer}>
                    <div classname={bannerStyles.flexContainer}>
                        <div classname={bannerStyles.leftContent}>
                         <div classname={bannerStyles.headerBadgeContainer}>
                            <div classname={bannerStyles.stethoscopeContainer}>
                                <div classname={bannerStyles.stethoscopeInner}>
                                    <Stetchoscope classname={bannerStyles.stetchoscopeIcon}/>

                                </div>

                            </div>
                            <div className={bannerStyles.titleContainer}>
                                <h1 classname={bannerStyles.title}>
                                    Medi
                                    <span classname={bannerStyles.titleGradient}>
                                        Care++

                                    </span>

                                </h1>
                                {/* Stars */}
                                <div classname={bannerStyles.starsrContainer}>
                                    <div classname={bannerStyles.starsInner}>
                                        {[1,2,3,4,5].map((star)=>(
                                            <star classname={bannerStyles.starIcon}
                                            key={star}/>
                                        ))}

                                    </div>

                                </div>

                            </div>

                         </div>
                         {/* tagline */}
                         <p classname={bannerStyles.tagline}>
                            Premium HealthCare
                            <span classname={`block ${bannerStyles.taglineHighlight}`}>
                                At your Fingertips

                            </span>

                         </p>
                         <div classname={bannerStyles.featuresGrid}>
                            <div classname={`${bannerStyles.featureItem} ${bannerStyles.featureBorderGreen}`}>
                                <Ribbon classname={bannerStyles.featureIcon}/>
                                <span classname={bannerStyles.featureText}>
                                    Certified Specialists
                                </span>

                            </div>
                                <div classname={`${bannerStyles.featureItem} ${bannerStyles.featureBorderblue}`}>
                                <Clock classname={bannerStyles.featureIcon}/>
                                <span classname={bannerStyles.featureText}>
                                    24/7 Availability
                                </span>

                            </div>
                                <div classname={`${bannerStyles.featureItem} ${bannerStyles.featureBorderEmerald}`}>
                                <Shielduser classname={bannerStyles.featureIcon}/>
                                <span classname={bannerStyles.featureText}>
                                    Safe &amp; Secure
                                </span>

                            </div>
                                <div classname={`${bannerStyles.featureItem} ${bannerStyles.featureBorderPurple}`}>
                                <Users classname={bannerStyles.featureIcon}/>
                                <span classname={bannerStyles.featureText}>
                                   500+ Doctors
                                </span>

                            </div>

                         </div>
                         <div classname={bannerStyles.ctaButtonContainer}>
                            <button on onClick={()=> navigate("/doctors")} classname={bannerStyles.bookButton}>
                                <div classname={bannerStyles.bookButtonOverlay}>
                                    <div classname={bannerStyles.bookButtonContent}>
                                        <Calendar classname={bannerStyles.bookButtonIcon}/>
                                        <span>
                                           Book Appointment Now 
                                        </span>

                                    </div>

                                </div>

                            </button>
                            <button onClick={()=>(window.location.href="tel:123456789")}
                                classname={bannerStyles.emergencyNumber}>
                                    <div classname={bannerStyles.emergencyButtonContent}>
                                        <phone classname={bannerStyles.emergencyButtonIcon}/>
                                        <span>
                                            Emergency Call
                                        </span>

                                    </div>

                            </button>

                         </div>
                        </div>
                        <div classname={bannerStyles.rightImageSection}>
                            <div classname={bannerStyles.imageContainer}>
                                <div classname={bannerStyles.imageFrame}>
                                    <img src={banner}alt="banner " classname={bannerStyles.image}/>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


            </div>

        </div>
    )
}
export default Banner