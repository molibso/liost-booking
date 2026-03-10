"use client";
import Image from "next/image";
import { useState } from "react";

const FitTrailer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="overflow-hidden scroll-mt-32   xl:pb-25 xl:">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-32.5">
          <div className="animate_right w-full md:w-1/2">
              <div className="relative 2xl:-mr-7.5">
          
                <div className="relative aspect-[750/500] w-full">
                  <iframe
                    className="w-full h-full rounded-lg shadow-lg border-4 border-[#01abca]"
                    src="https://www.youtube.com/embed/3AdGZYLvvZ8"
                    title="molibso dyneos SANI Demo"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
               <h2 id="fit-trailer" className="mb-4 mt-6 text-3xl font-medium text-black dark:text-white" style={{fontWeight:'700 '}}>
               Erleben Sie unseren Fit Trailer live auf dem Liost-Kongress!    {"   "}
          
              </h2>
              <div className="mb-2.5 text-lg text-black dark:text-white" style={{fontWeight:400}}>
                <p className="mb-2">
                  Unser Highlight auf dem Kongress: der <strong>Fit Trailer</strong> – ein mobiles Fuß- und Schuhlabor, das alle Blicke auf sich zieht. Im Inneren erwartet Sie eine zwei Meter lange Druckmessplatte, dazu zwei Bildschirme, auf denen die Analyseergebnisse direkt besprochen werden können.
                </p>
                
                <p className="mb-2">
                  Der Trailer ist so ausgestattet, dass er die Ganganalyse sowie die Beratung für Sie und Ihre Kunden zu einem unvergesslichen Erlebnis macht:
                </p>
                
                <ul className="space-y-3 mb-2">
                  <li className="flex items-start">
                    <span className="text-[#29c3ec] mr-3 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="mb-2">Regale zur Präsentation von Schuhen oder Einlagen</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#29c3ec] mr-3 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="mb-2">eine komfortable Bank, um Schuhe bequem an- und auszuprobieren</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#29c3ec] mr-3 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                                  <p className="mb-2">eine durch indirekte bunte Lichter erzeugte Atmosphäre, die neugierig macht und zum Mitmachen einlädt</p>
                  </li>
                </ul>
                
                <p className="mb-2">
                  Und das Beste: Der Fit Trailer ist mobil. Sie können ihn für Ihre eigenen Events zusammen mit fachkundigem Personal von molibso mieten. Ob Messe, Aktionstag im Sanitätshaus oder Außenevent – mit dem Fit-Trailer mieten Sie eine Druckmessplatte mit Wow-Faktor und setzen ein starkes Zeichen für Innovation und Kundennähe.
                </p>
              </div>
               
 
         
             </div>

            
            
          </div>
        </div>
       </section>
    </>
  );
};

export default FitTrailer;
