"use client";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "dayjs/locale/de";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const Contact = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    street: "",
    housenumber: "",
    zip_code: "",
    city:"",
    email: "",
    birthday: "",
    // Step 2 — Questionnaire fields
    job_activity: "",
    sport_activity: "",
    complaint_location: "",
    complaint_dependency: "",
    pain_scale: "",
    usual_shoes: "",
    shoe_change_frequency: "",
    special_sport_shoes: "",
    insoles_current: "",
    insoles_past: "",
    insoles_satisfaction: "",
    other_aids: "",
    diabetes: "",
    rheuma_arthritis: "",
    neuro_diseases: "",
    foot_leg_operations: "",
    other_conditions: "",
    // Optional anamnese image
    anamnese_image_base64: "",
    anamnese_image_name: "",
    anamnese_image_type: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    activity: true,
    complaints: false,
    shoes: false,
    aids: false,
    conditions: false,
    anamnese: false
  });
  const eventDate1Str = process.env.NEXT_PUBLIC_EVENT_DATE_1 || "2025-10-24";
  const eventDate2Str = process.env.NEXT_PUBLIC_EVENT_DATE_2 || "2025-10-25";
  const eventName1 = process.env.NEXT_PUBLIC_EVENT_NAME_1 || "OST1";
  const eventName2 = process.env.NEXT_PUBLIC_EVENT_NAME_2 || "OST2";
  const eventDate1 = dayjs(eventDate1Str);
  const eventDate2 = dayjs(eventDate2Str);
  const [selectedDate, setSelectedDate] = useState(eventDate1);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = checkbox1 || checkbox2 || checkbox3;
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const isFirstDay = selectedDate.isSame(eventDate1, "day");
    const eventName = isFirstDay ? eventName1 : eventName2;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/events?event=${eventName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        sessionStorage.setItem("appointments", JSON.stringify(data));
        const eventDate = selectedDate.format("YYYY-MM-DD");
        setAppointments({
          [eventDate]: data.map((a: any) => a.timeslot),
        });
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [selectedDate, hasMounted, eventDate1Str, eventDate2Str, eventName1, eventName2]);

  if (!hasMounted) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Bitte ein Bildformat auswählen (JPEG, PNG, GIF, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        anamnese_image_base64: typeof reader.result === "string" ? reader.result : "",
        anamnese_image_name: file.name,
        anamnese_image_type: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const nextStep = () => {
    // Skip Fragebogen (step 2) and calendar (step 3) for now
    if (step === 1) {
      setStep(4);
    }
  };

  const prevStep = () => {
    if (step === 4) {
      setStep(1);
    }
  };

  const sendQuestionnaireData = async (customerId) => {
    try {
      const questionnairePayload = {
        "customer_id": customerId,
        "online_general_data": {
          "birthday": formData.birthday,
          "body_height": "", // Add if you have this field
          "body_weight": "", // Add if you have this field
          "professional_activity": formData.job_activity,
          "sports_activity": formData.sport_activity
        },
        "online_complaints": {
          "localized_complaints": [formData.complaint_location],
          "dependence_on_exertion": [formData.complaint_dependency],
          "pain_intensity": formData.pain_scale
        },
        "online_shoe_habits": {
          "frequently_worn_shoes": formData.usual_shoes,
          "change_shoes_often": formData.shoe_change_frequency,
          "use_special_shoes": formData.special_sport_shoes
        },
        "online_hilfsmittel": {
          "has_insoles": formData.insoles_current,
          "have_worn_insoles": formData.insoles_past,
          "insoles_satisfaction": formData.insoles_satisfaction,
          "have_used_other_aids": formData.other_aids,
          "orthotics_bandages": "" // Add if you have this field
        },
        "online_pre_existing_conditions": {
          "diabetes_mellitus": formData.diabetes,
          "rheumatism": formData.rheuma_arthritis === "ja",
          "neurological_diseases": formData.neuro_diseases === "ja",
          "surgery_to_the_leg": formData.foot_leg_operations === "ja",
          "other_diseases": formData.other_conditions
        }
      };

      if (!process.env.NEXT_PUBLIC_HOST || !process.env.NEXT_PUBLIC_SYSTEM_TOKEN_TWO) {
        console.error("NEXT_PUBLIC_HOST or NEXT_PUBLIC_SYSTEM_TOKEN environment variables are not set");
        return;
      }

      const questionnaireUrl = `${process.env.NEXT_PUBLIC_HOST}/api/v1/questionaire/customers/${customerId}/online-questionnaire?s=${process.env.NEXT_PUBLIC_SYSTEM_TOKEN_TWO}`;
      
      const response = await fetch(questionnaireUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
        body: JSON.stringify(questionnairePayload),
      });

      if (!response.ok) {
        console.error("Failed to send questionnaire data");
      }
    } catch (error) {
      console.error("Error sending questionnaire data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid || !captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }
    if (!formData.first_name || !formData.last_name || !formData.email) {
      alert("Bitte füllen Sie Vorname, Nachname und E-Mail-Adresse aus.");
      return;
    }

    setIsSubmitting(true);

    const payload = { ...formData, captchaToken };
    const apiUrl1 = `${process.env.NEXT_PUBLIC_BUNERT_URL}?s=${process.env.NEXT_PUBLIC_SYSTEM_TOKEN_ONE}`;
    const apiUrl2 = `${process.env.NEXT_PUBLIC_BUNERT_URL}?s=${process.env.NEXT_PUBLIC_SYSTEM_TOKEN_TWO}`;

    try {
      // First request with SYSTEM_TOKEN_ONE (errors are logged but don't block)
      try {
        await fetch(apiUrl1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("Error submitting form to apiUrl1:", error);
      }

      // Second request with SYSTEM_TOKEN_TWO (authoritative for success)
      const response = await fetch(apiUrl2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status === 1) {
          setIsModalOpen(true);
        } else {
          console.error("Invalid response format or error status from apiUrl2", responseData);
          alert("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
        }
      } else {
        alert("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      first_name: "",
      last_name: "",
      street: "",
      housenumber: "",
      zip_code: "",
      city:"",
      email: "",
      birthday: "",
      job_activity: "",
      sport_activity: "",
      complaint_location: "",
      complaint_dependency: "",
      pain_scale: "",
      usual_shoes: "",
      shoe_change_frequency: "",
      special_sport_shoes: "",
      insoles_current: "",
      insoles_past: "",
      insoles_satisfaction: "",
      other_aids: "",
      diabetes: "",
      rheuma_arthritis: "",
      neuro_diseases: "",
      foot_leg_operations: "",
      other_conditions: "",
      anamnese_image_base64: "",
      anamnese_image_name: "",
      anamnese_image_type: "",
    });
    setCheckbox1(false);
    setCheckbox2(false);
    setCheckbox3(false);
    setCaptchaToken(null);
    router.push("/");

  };

  return (
    <>
      <section
        id="support"
        className="px-4 md:px-8 2xl:px-0 font-montserrat"
        style={{
          backgroundColor: "white",
          marginBottom: "22px",
          marginTop: "-100px",
        }}
      >
        <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20 font-montserrat">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
          <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
            <Image
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="./images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="order-2 w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:order-1 md:w-3/5 lg:w-3/4 xl:p-15"
            >
              <h2
                className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "#20a8c4",
                }}
              >
                Registrieren
              </h2>

              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                  <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Vorname <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Vorname"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 ${
                          !formData.first_name && "border-red-500"
                        }`}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Nachname <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Nachname"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 ${
                          !formData.last_name && "border-red-500"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-7.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">
                      E-Mail-Adresse <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="E-Mail-Adresse"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 ${
                        !formData.email && "border-red-500"
                      }`}
                      required
                    />
                  </div>

                  <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Straße
                      </label>
                      <input
                        type="text"
                        name="street"
                        placeholder="Straße"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full border-b border-stroke bg-transparent pb-3.5"
                      />
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Hausnummer
                      </label>
                      <input
                        type="text"
                        name="housenumber"
                        placeholder="Hausnummer"
                        value={formData.housenumber}
                        onChange={handleInputChange}
                        className="w-full border-b border-stroke bg-transparent pb-3.5"
                      />
                    </div>
                  </div>

                  <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        PLZ
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        placeholder="PLZ"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        className="w-full border-b border-stroke bg-transparent pb-3.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Ort
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Ort"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border-b border-stroke bg-transparent pb-3.5"
                      />
                    </div>
                  </div>

                  <div
                    className="mb-11.5 flex"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label>Geburtsdatum:</label>
                    <div>
                      <input
                        type="date"
                        name="birthday"
                        placeholder="Birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        className="w-full border-b border-stroke bg-transparent pb-3.5"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      aria-label="Weiter"
                      style={{ backgroundColor: "#20a8c4" }}
                      className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-medium text-white"
                    >
                      Weiter
                      <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {false && step === 2 && (
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  
                  // Validate questionnaire fields before proceeding
                  const requiredQuestionnaireFields = [
                    'job_activity', 'sport_activity', 'complaint_location', 'complaint_dependency', 
                    'pain_scale', 'usual_shoes', 'shoe_change_frequency', 'special_sport_shoes',
                    'insoles_current', 'insoles_past', 'insoles_satisfaction', 'other_aids',
                    'diabetes', 'rheuma_arthritis', 'neuro_diseases', 'foot_leg_operations'
                  ];

                  const missingFields = requiredQuestionnaireFields.filter(field => !formData[field]);
                  if (missingFields.length > 0) {
                    alert("Bitte füllen Sie alle Pflichtfelder im Fragebogen aus.");
                    return;
                  }
                  
                  nextStep(); 
                }} className="font-montserrat">
                  <h3 className="mb-6 text-xl font-semibold text-black dark:text-white font-montserrat">Fragebogen</h3>

                  {/* Allgemeine Aktivität */}
                  <div className="mb-7.5 rounded-lg border border-stroke dark:border-strokedark">
                    <button
                      type="button"
                      onClick={() => toggleSection('activity')}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-black dark:text-white font-montserrat">
                        <span className="text-red-500">*</span> Allgemeine Aktivität
                      </h4>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSections.activity ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.activity && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Berufliche Tätigkeit
                            </label>
                            <select name="job_activity" value={formData.job_activity} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="stehend">Stehend</option>
                              <option value="gehend">Gehend</option>
                              <option value="sitzend">Sitzend</option>
                              <option value="wechselnd">Wechselnd</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Sportliche Aktivität
                            </label>
                            <select name="sport_activity" value={formData.sport_activity} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="keine">Keine</option>
                              <option value="freizeit">Freizeit</option>
                              <option value="leistungssport">Leistungssport</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Beschwerden */}
                  <div className="mb-7.5 rounded-lg border border-stroke dark:border-strokedark">
                    <button
                      type="button"
                      onClick={() => toggleSection('complaints')}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-black dark:text-white font-montserrat">
                        <span className="text-red-500">*</span> Beschwerden
                      </h4>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSections.complaints ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.complaints && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Beschwerden lokalisiert
                            </label>
                            <select name="complaint_location" value={formData.complaint_location} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="vorfuss">Vorfuß</option>
                              <option value="ferse">Ferse</option>
                              <option value="mittelfuss">Mittelfuß</option>
                              <option value="sprunggelenk">Sprunggelenk</option>
                              <option value="knie">Knie</option>
                              <option value="huefte">Hüfte</option>
                              <option value="ruecken">Rücken</option>
                              <option value="keine">Keine</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Belastungsabhängigkeit
                            </label>
                            <select name="complaint_dependency" value={formData.complaint_dependency} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="gehen">Beim Gehen</option>
                              <option value="stehen">Beim Stehen</option>
                              <option value="sport">Beim Sport</option>
                              <option value="ruhe">In Ruhe</option>
                              <option value="keine">Keine</option>
                            </select>
                          </div>
                          <div className="flex flex-col lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 font-montserrat">
                              Schmerzausprägung (Skala 1-10)
                            </label>
                            <input type="number" min="1" max="10" name="pain_scale" value={formData.pain_scale} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Schuhgewohnheiten */}
                  <div className="mb-7.5 rounded-lg border border-stroke dark:border-strokedark">
                    <button
                      type="button"
                      onClick={() => toggleSection('shoes')}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-black dark:text-white font-montserrat">
                        <span className="text-red-500">*</span> Schuhgewohnheiten
                      </h4>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSections.shoes ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.shoes && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Häufig getragene Schuhe
                            </label>
                            <select name="usual_shoes" value={formData.usual_shoes} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="sneaker">Sneaker</option>
                              <option value="sicherheitsschuhe">Sicherheitsschuhe</option>
                              <option value="arbeitsschuhe">Arbeitsschuhe</option>
                              <option value="elegant">Elegante Schuhe</option>
                              <option value="sandalen">Sandalen</option>
                              <option value="sportschuhe">Sportschuhe</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Schuhwechsel im Alltag
                            </label>
                            <select name="shoe_change_frequency" value={formData.shoe_change_frequency} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="selten">Selten</option>
                              <option value="haeufig">Häufig</option>
                            </select>
                          </div>
                          <div className="flex flex-col lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 font-montserrat">
                              Nutzung spezieller Sportschuhe
                            </label>
                            <select name="special_sport_shoes" value={formData.special_sport_shoes} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="ja">Ja</option>
                              <option value="nein">Nein</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hilfsmittel */}
                  <div className="mb-7.5 rounded-lg border border-stroke dark:border-strokedark">
                    <button
                      type="button"
                      onClick={() => toggleSection('aids')}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-black dark:text-white font-montserrat">
                        <span className="text-red-500">*</span> Hilfsmittel
                      </h4>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSections.aids ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.aids && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Aktuelle Einlagenversorgung vorhanden?
                            </label>
                            <select name="insoles_current" value={formData.insoles_current} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="ja">Ja</option>
                              <option value="nein">Nein</option>
                              <option value="weiss_nicht">Weiß nicht</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Frühere Einlagen getragen?
                            </label>
                            <select name="insoles_past" value={formData.insoles_past} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="ja">Ja</option>
                              <option value="nein">Nein</option>
                              <option value="weiss_nicht">Weiß nicht</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Zufriedenheit mit bisherigen Einlagen
                            </label>
                            <select name="insoles_satisfaction" value={formData.insoles_satisfaction} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="sehr_zufrieden">Sehr zufrieden</option>
                              <option value="teilweise">Teilweise</option>
                              <option value="unzufrieden">Unzufrieden</option>
                              <option value="keine_angabe">Keine Angabe</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Andere Hilfsmittel genutzt (Bandagen/Orthesen)?
                            </label>
                            <select name="other_aids" value={formData.other_aids} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="ja">Ja</option>
                              <option value="nein">Nein</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vorerkrankungen */}
                  <div className="mb-7.5 rounded-lg border border-stroke dark:border-strokedark">
                    <button
                      type="button"
                      onClick={() => toggleSection('conditions')}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-black dark:text-white font-montserrat">
                        <span className="text-red-500">*</span> Vorerkrankungen
                      </h4>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSections.conditions ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.conditions && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Diabetes mellitus
                            </label>
                            <select name="diabetes" value={formData.diabetes} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="typ1">Typ 1</option>
                              <option value="typ2">Typ 2</option>
                              <option value="nein">Nein</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Rheuma / Arthritis
                            </label>
                            <select name="rheuma_arthritis" value={formData.rheuma_arthritis} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="ja">Ja</option>
                              <option value="nein">Nein</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Neurologische Erkrankungen
                            </label>
                            <select name="neuro_diseases" value={formData.neuro_diseases} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="ja">Ja</option>
                              <option value="nein">Nein</option>
                            </select>
                          </div>
                          <div className="flex flex-col h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 min-h-[2.5rem] flex items-start font-montserrat">
                              Operationen / Verletzungen am Fuß oder Bein
                            </label>
                            <select name="foot_leg_operations" value={formData.foot_leg_operations} onChange={handleInputChange} className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat">
                              <option value="">Bitte wählen</option>
                              <option value="ja">Ja</option>
                              <option value="nein">Nein</option>
                            </select>
                          </div>
                          <div className="flex flex-col lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2 font-montserrat">
                              Sonstige relevante Erkrankungen
                            </label>
                            <input type="text" name="other_conditions" value={formData.other_conditions} onChange={handleInputChange} placeholder="Beschreibung" className="w-full px-3 py-3 border border-stroke rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#20a8c4] focus:border-transparent font-montserrat" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Anamnese Upload */}
                  <div className="mb-7.5 rounded-lg border border-stroke dark:border-strokedark">
                    <button
                      type="button"
                      onClick={() => toggleSection('anamnese')}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="text-lg font-semibold text-black dark:text-white font-montserrat">Anamnese (optional)</h4>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSections.anamnese ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSections.anamnese && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white font-montserrat">Anamnese als Bild hochladen</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-[#20a8c4] file:px-4 file:py-2 file:text-white hover:file:opacity-90" />
                            {formData.anamnese_image_name && (
                              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">Datei: {formData.anamnese_image_name}</p>
                            )}
                          </div>
                          {formData.anamnese_image_base64 && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-white font-montserrat">Vorschau</label>
                              <img src={formData.anamnese_image_base64} alt="Anamnese Vorschau" className="mt-2 max-h-48 rounded border" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button type="button" onClick={prevStep} style={{ backgroundColor: "#20a8c4" }} className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-medium text-white">Zurück</button>
                    <button type="submit" style={{ backgroundColor: "#20a8c4" }} className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-medium text-white">Weiter</button>
                  </div>
                </form>
              )}

              {false && step === 3 && (
                <div />
              )}

              {step === 4 && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6 rounded-lg border bg-gray-100 p-6 text-center dark:bg-gray-800">
                   
                    <p className="mt-2 text-md text-gray-700 dark:text-gray-300">
                      <b> Ort:</b>  Science Congress Center Munich, Garching
                    </p>
                    <p className="mt-2 text-md text-gray-700 dark:text-gray-300">
                      <b>Datum:</b> 13. und 14. März 2026
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="mb-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={checkbox3}
                        onChange={() => setCheckbox3(!checkbox3)}
                        className="mr-3 h-5 w-5 flex-shrink-0 align-middle"
                      />
                      <label className="align-middle text-sm">
                        Ja, ich stimme zu, mich für die Ganganalyse zu registrieren.
                      </label>
                    </div>

                    <div className="mb-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={checkbox1}
                        onChange={() => setCheckbox1(!checkbox1)}
                        className="mr-3 h-5 w-5 flex-shrink-0 align-middle"
                      />
                      <label className="align-middle text-sm">
                        Ja, ich möchte mich für den Newsletter von molibso registrieren, um über Veranstaltungen, Neuerungen sowie besondere Aktionen und Angebote informiert zu werden. 
                      </label>
                    </div>

                    <div className="mb-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={checkbox2}
                        onChange={() => setCheckbox2(!checkbox2)}
                        className="mr-3 h-5 w-5 flex-shrink-0 align-middle"
                      />
                      <label className="align-middle text-sm">
                        Hiermit bestätige ich, die Allgemeinen Geschäftsbedingungen gelesen, verstanden und akzeptiert zu haben. 
                      </label>
                    </div>

                    <div className="mb-4">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                      />
                    </div>

                    <div className="flex w-full items-center justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        style={{ backgroundColor: "#20a8c4" }}
                        className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-medium text-white"
                      >
                        Zurück
                      </button>

                      <button
                        type="submit"
                        aria-label="Bestätigen"
                        disabled={!isFormValid || !captchaToken || isSubmitting}
                        style={{ backgroundColor: "#20a8c4" }}
                        className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-medium text-white ${
                          isFormValid && captchaToken && !isSubmitting ? "hover:bg-dark bg-black" : "cursor-not-allowed bg-gray-500"
                        }`}
                      >
                        {isSubmitting ? "Wird verarbeitet..." : "Bestätigen"}
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="order-1 flex-1 rounded-lg p-7.5 md:order-2"
            >
              <h2
                className="mt-7 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "#20a8c4",
                }}
              >
                Haftungsausschluss
              </h2>
              <p className="mt-4 text-sm text-black dark:text-white">
                Meine Daten werden ausschließlich zu diesem Zweck erfasst, elektronisch gespeichert sowie verwendet und nicht an Dritte weitergegeben. Diese Einwilligung kann ich jederzeit per E-Mail an <a href="mailto:mail@molibso.com" className="underline text-[#20a8c4]">molibso@dyneos.de</a> widerrufen.
              </p>
            </motion.div>
          </div>
       
       
        
        </div>
      </section>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Contact;
