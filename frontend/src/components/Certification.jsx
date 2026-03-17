import React from 'react'
import {certificationStyles} from '../assets/frontend/dummyStyles';
import C3 from "../assets/C3.png"
import C1 from "../assets/C1.png"
import C2 from "../assets/C2.png"
import C4 from "../assets/C4.svg"
import C5 from "../assets/C5.png"
import C6 from "../assets/C6.png"
import C7 from "../assets/C7.svg"
const Certification=()=>{
      const certifications = [
    { id: 1, name: "Medical Commission", image: C1, type: "international" },
    { id: 2, name: "Government Approved", image: C2, type: "government" },
    { id: 3, name: "NABH Accredited", image: C3, alt: "NABH Accreditation", type: "healthcare" },
    { id: 4, name: "Medical Council", image: C4, type: "government" },
    { id: 5, name: "Quality Healthcare", image: C5, alt: "Quality Healthcare", type: "healthcare" },
    { id: 6, name: "Paramedical Council", image: C6, alt: "Patient Safety", type: "healthcare" },
    { id: 7, name: "Ministry of Health", image: C7, alt: "Ministry of Health", type: "government" }
  ];
    const duplicatedCertifications = [...certifications, ...certifications, ...certifications];
    return(
        <div classname={certificationStyles.conatiner}> 
        <div classname={certificationStyles.backgroundGrid}>
            <div classname={certificationStyles.topline}>

            </div>
            <div classname={certificationStyles.gridConatiner}>
                <div classname={certificationStyles.grid}>
                    {Array.from({length:144}).map((_,i)=>(
                        <div key={i} classname={certificationStyles.gridCell}>

                        </div>
                    ))}

                </div>

            </div>

        </div>
        <div classname={certificationStyles.contentWrapper}>
            <div classname={certificationStyles.headingConatiner}>
                <div classname={certificationStyles.headingInner}>
                    <div classname={certificationStyles.leftLine}>

                    </div>
                    <div classname={certificationStyles.rightLine}>

                    </div>
                    <h2 classname={certificationStyles.title}>
                        <span classname={certificationStyles.titleText}>
                            CERTIFIED & EXCELLENCE

                        </span>

                    </h2>

                </div>
                <p classname={certificationStyles.subtitle}>
                    Government Recognized and Internationally accredited healthcare

                </p>
                <div classname={certificationStyles.badgeContainer}>
                    <div classname={certificationStyles.badgeDot}>


                    </div>
                    <span classname={certificationStyles.badgeText}>
                        OFFICIALLY CERTIFIED

                    </span>

                </div>

            </div>
            <div classname={certificationStyles.logosContainer}>
                <div classname={certificationStyles.logosInner}>
                    <div classname={certificationStyles.logosFlexContainer}>
                        <div classname={certificationStyles.logosMarquee}>
                            {duplicatedCertifications.map((cert,index)=>(
                                <div key={`cert-${cert.id}-${index}`} 
                                classname={certificationStyles.logoItem}>
                                    <div classname="relative">
                                        <img src={cert.image} alt={cert.alt}
                                        classname={certificationStyles.logoImage}/>
                                        </div>
                                        <span classname={certificationStyles.logoText}>
                                            {cert.name}

                                        </span>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
        <style classname={certificationStyles.animationStyles}>

        </style>

        </div>
    );
};
export default Certification;