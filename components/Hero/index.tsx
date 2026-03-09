  "use client";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
               <h3 className="mb-4.5 mt-6 text-3xl font-medium text-black dark:text-white" style={{fontWeight:'700 '}}>
               Melden Sie sich jetzt für Ihre individuelle Ganganalyse an    {"   "}
          
              </h3>
              <h3 className="mb-4.5 text-xl   text-black dark:text-white" style={{fontWeight:400}}>
Sie möchten Beschwerden vorbeugen und Ihr Ganggefühl oder Ihren Laufstil verbessern? Oder suchen Sie eine fundierte Grundlage für maßgefertigte Einlagen? – Dann registrieren Sie sich jetzt für eine professionelle 
             <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-[#90d7e2] dark:before:bg-[#00aec7] " style={{marginRight:"6px", marginLeft:"6px"}}>
Ganganalyse!              </span> 
                                <br />  

Unsere selbst entwickelte Analyse kombiniert modernste KI-Technologie mit der persönlichen Expertise von Fachleuten. So erhalten Sie eine individuelle Empfehlung, die optimal auf Ihre Bedürfnisse abgestimmt ist. 
                 </h3>
               {/* <p>
              Zusätzlich haben wir das   Bonusprogramm: einmal pro Jahr be-
              kommst Du von uns einen Gutschein in Höhe von 3 % Deines Jah-re-s einkaufswerts vom Vorjahr. 
              Diesen kannst Du jederzeit bis zum 30. Juni des jeweiligen Gültigkeits jahres und ohne Mindest-
              einkaufswert bei uns einlösen.          
                  </p>/
                  <br />  

              <p>
              Wenn Du nicht am   t-eilnehmen möchtest, informieren wir 
              Dich trotzdem gerne über Neuigkeiten und Aktionen. Lasse Dich dafür einfach in unsere 
              Kundendatei aufnehmen.                 
                </p>
                  <br />  

              <p>
              Worauf wartest Du noch?                </p> */}
               <p className="mb-4.5 text-xl font-medium text-black dark:text-white">
Jetzt registrieren und Vorteile sichern!
              </p>
 
                  <a href="#support">
  <button
    aria-label="login with email and password"
    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho" style={{backgroundColor:"#20a8c4"}}
  >
    Registrieren                
    <svg
      className="fill-white"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
        fill=""
      />
    </svg>
  </button>
</a>

             </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
          
                <div className=" relative aspect-[750/500] w-full">
                  <Image
                  className="shadow-solid-l dark:hidden border-4 border-[#01abca]" 
                   src="/images/analysis_hero.png"
                    alt="Hero"
                    fill
                  />
                  <Image
                    className="hidden shadow-solid-l dark:block border-4 border-[#01abca]"
                    src="/images/analysis_hero.png"
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
       </section>
    </>
  );
};

export default Hero;
