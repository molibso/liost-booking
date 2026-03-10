"use client";
import React from "react";
import featuresData from "./featuresData";
import SingleFeature from "./SingleFeature";
import SectionHeader from "../Common/SectionHeader";

const Feature = () => {
  return (
    <>
      {/* <!-- ===== Features Start =====-- --> */}
      <section
        id="features"
        className="py-20 lg:py-25 l:py-30 scroll-mt-32"
      >
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 l:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: " ",
              subtitle: "Ihre Vorteile auf einen Blick:",
              description: ``,
            }}
          />
          {/* <!-- Section Title End --> ---*/}

          <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 l:gap-12.5">
            {/* <!-- Features item Start --> */}

            {featuresData.map((feature, key) => (
              <SingleFeature feature={feature} key={key} />
            ))}
            {/* <!-- Features item End --> */}
          </div>
          <h2 className="mb-4.5 mt-8  text-center text-2xl font-medium text-black dark:text-white">
          {/* <b>  Kein Interesse am Bonusprogramm? </b> */}
          </h2>
          {/* <h3 className="mb-2 text-l font-medium text-black dark:text-white" style={{textAlign:"center"}}>
          Kein Problem! Du kannst Dich trotzdem in unsere Kundendatei aufnehmen lassen, um über Neuigkeiten und Angebote informiert zu werden.</h3> */}
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Feature;
