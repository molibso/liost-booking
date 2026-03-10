"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t border-stroke bg-white dark:border-strokedark dark:bg-blacksection">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="py-12 flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
          {/* Kunderservice */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="font-bold uppercase mb-4 text-black dark:text-white text-sm tracking-wide">Weiterführende Links</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li><a href="https://liostevents.de/" className="hover:text-primary">Liost-Kongress</a></li>
              <li><a href="https://molibso.com/de/produkt/" className="hover:text-primary">Produkt</a></li>
              <li><a href="https://molibso.com/de/sport-schuhfachhandel/" className="hover:text-primary">Fachhandel</a></li>
              <li><a href="https://molibso.com/de/orthopaedieschuhtechnik/" className="hover:text-primary">Orthopaedietechnik</a></li>
              <li><a href="https://molibso.com/de/industrie/" className="hover:text-primary">Industrie</a></li>
             </ul>
          </div>
          {/* Kontakt */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="font-bold uppercase mb-4 text-black dark:text-white text-sm tracking-wide">KONTAKT</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li><a href="tel:+4977198811700" className="hover:text-primary">+49 (0) 2173 / 207 094 0</a></li>
               <li><a href="mailto:mail@molibso.com" className="hover:text-primary">mail@molibso.com</a></li>
              <li><a href="#" className="hover:text-primary">Karl-Benz-Str. 1 40764 Langenfeld</a></li>
            </ul>
             
          </div>
          {/* Unternehmen */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="font-bold uppercase mb-4 text-black dark:text-white text-sm tracking-wide">UNTERNEHMEN</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li><a href="https://molibso.com/de/anfahrt-kontakt/" className="hover:text-primary">Anfahrt & Kontakt</a></li>
              <li><a href="https://molibso.com/de/unternehmen/" className="hover:text-primary">molibso Team</a></li>
              <li><a href="https://molibso.com/de/kunden-projekte/" className="hover:text-primary">Kunden & Projekte</a></li>
              <li><a href="https://molibso.com/de/vertriebspartner/" className="hover:text-primary">Vertriebspartner</a></li>
             </ul>
          </div>
          {/* Produktinfos */}
         </div>
        <div className="flex flex-col items-center justify-center border-t border-stroke py-4 mt-4">
          <p className="text-m text-gray-500">&copy; {new Date().getFullYear()} molibso. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
