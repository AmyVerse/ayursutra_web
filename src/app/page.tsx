"use client";
import Image from "next/image";
import { useState } from "react";

// Patient Dashboard Component
function PatientDashboard({
  email,
  doctors,
  bookedAppointments,
  onBookAppointment,
  onLogout,
}: any) {
  const [selectedTab, setSelectedTab] = useState("find-doctors");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/ayur.svg"
                alt="AyurSutra Logo"
                width={200}
                height={75}
                className="h-8 w-auto"
                priority
              />
              <span className="ml-3 text-gray-600">Patient Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{email}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setSelectedTab("find-doctors")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "find-doctors"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Find Doctors
          </button>
          <button
            onClick={() => setSelectedTab("appointments")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "appointments"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Appointments
          </button>
        </div>

        {selectedTab === "find-doctors" && (
          <div>
            {/* IVR Link */}
            <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-teal-400 text-2xl">📋</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-teal-700">
                    Before booking an appointment, please complete your initial
                    health assessment.
                  </p>
                  <a
                    href="https://ayurvedic-dosha-diagnosis1.onrender.com"
                    className="text-teal-600 hover:text-teal-500 font-medium text-sm underline mt-1 inline-block"
                  >
                    Fill the IVR Initial Vital Report →
                  </a>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor: any) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">{doctor.image}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-teal-600 font-medium">
                          {doctor.specialization}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doctor.experience} • {doctor.location}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {doctor.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Available Slots:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {doctor.availableSlots
                          .slice(0, 4)
                          .map((slot: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => onBookAppointment(doctor, slot)}
                              className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs rounded-lg transition-colors border border-teal-200"
                            >
                              {new Date(slot).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Appointments
            </h2>
            {bookedAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500">No appointments booked yet</p>
                <button
                  onClick={() => setSelectedTab("find-doctors")}
                  className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Find Doctors
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookedAppointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-xl shadow-sm border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">
                          {appointment.doctorImage}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-teal-600">
                            {appointment.doctorSpecialization}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.dateTime).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Doctor Dashboard Component
function DoctorDashboard({ email, bookedAppointments, onLogout }: any) {
  const [selectedTab, setSelectedTab] = useState("appointments");

  // Sample doctor data for the logged-in doctor
  const doctorProfile = {
    name: "Dr. Rajesh Sharma",
    specialization: "Panchakarma Specialist",
    experience: "15 years",
    rating: 4.8,
    totalPatients: 1250,
    image: "👨‍⚕️",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/ayur.svg"
                alt="AyurSutra Logo"
                width={200}
                height={75}
                className="h-8 w-auto"
                priority
              />
              <span className="ml-3 text-gray-600">Doctor Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{email}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center">
            <div className="text-6xl mr-6">{doctorProfile.image}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {doctorProfile.name}
              </h1>
              <p className="text-teal-600 font-medium text-lg">
                {doctorProfile.specialization}
              </p>
              <p className="text-gray-600">
                {doctorProfile.experience} Experience
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-lg font-semibold text-gray-700 ml-1">
                  {doctorProfile.rating}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {doctorProfile.totalPatients} Total Patients
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setSelectedTab("appointments")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "appointments"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setSelectedTab("patients")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "patients"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Patients
          </button>
        </div>

        {selectedTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Today's Appointments
            </h2>
            {bookedAppointments.filter(
              (apt: any) => apt.doctorName === doctorProfile.name
            ).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500">
                  No appointments scheduled for today
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookedAppointments
                  .filter((apt: any) => apt.doctorName === doctorProfile.name)
                  .map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="bg-white rounded-xl shadow-sm border p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">🤒</div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Patient Appointment
                            </h3>
                            <p className="text-gray-600">
                              Panchakarma Consultation
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                appointment.dateTime
                              ).toLocaleDateString("en-IN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {appointment.status}
                          </span>
                          <div className="mt-2">
                            <button className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {selectedTab === "patients" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Patients
            </h2>
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500">
                Patient management system coming soon
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You'll be able to view patient history, reports, and treatment
                plans here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const [loginStep, setLoginStep] = useState("input"); // "input", "otp", "doctor-signup"
  const [isDoctorSignup, setIsDoctorSignup] = useState(false);
  const [hprId, setHprId] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [doctorName, setDoctorName] = useState("");

  // Hardcoded doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      specialization: "Panchakarma Specialist",
      experience: "15 years",
      rating: 4.8,
      availableSlots: [
        "2025-09-25 10:00",
        "2025-09-25 14:00",
        "2025-09-26 09:00",
        "2025-09-27 11:00",
      ],
      image: "👨‍⚕️",
      location: "Mumbai, Maharashtra",
    },
    {
      id: 2,
      name: "Dr. Priya Nair",
      specialization: "Ayurvedic Physician",
      experience: "12 years",
      rating: 4.9,
      availableSlots: [
        "2025-09-25 11:00",
        "2025-09-25 15:00",
        "2025-09-26 10:00",
        "2025-09-27 14:00",
      ],
      image: "👩‍⚕️",
      location: "Kerala, India",
    },
    {
      id: 3,
      name: "Dr. Arjun Patel",
      specialization: "Herbal Medicine Expert",
      experience: "20 years",
      rating: 4.7,
      availableSlots: [
        "2025-09-25 12:00",
        "2025-09-25 16:00",
        "2025-09-26 11:00",
        "2025-09-27 15:00",
      ],
      image: "👨‍⚕️",
      location: "Gujarat, India",
    },
    {
      id: 4,
      name: "Dr. Meera Singh",
      specialization: "Women's Ayurvedic Health",
      experience: "18 years",
      rating: 4.9,
      availableSlots: [
        "2025-09-25 13:00",
        "2025-09-25 17:00",
        "2025-09-26 12:00",
        "2025-09-27 16:00",
      ],
      image: "👩‍⚕️",
      location: "Delhi, India",
    },
  ];

  const handleGetStarted = () => {
    setShowLoginPage(true);
  };

  const handleSendOtp = () => {
    if (mobileOrEmail) {
      // Simulate sending OTP
      setLoginStep("otp");
      // In real implementation, call API to send OTP
    }
  };

  const handleVerifyOtp = () => {
    if (otp) {
      // Simulate OTP verification
      if (isDoctorSignup) {
        // For doctor signup, redirect to doctor dashboard
        window.location.href = "/dashboard";
      } else {
        // For patients, show inline dashboard
        setShowDashboard(true);
      }
    }
  };

  const handleDoctorSignup = () => {
    if (hprId || abhaId) {
      // Simulate fetching doctor details from HPR/ABHA registry
      // In real implementation, this would call API to verify ID and get registered mobile
      const simulatedRegisteredMobile = "+91 98765-43210"; // This would come from API
      setMobileOrEmail(simulatedRegisteredMobile);

      // Move to OTP step after fetching details
      setLoginStep("otp");
    }
  };

  const handleBookAppointment = (doctor: any, slot: string) => {
    const appointment = {
      id: Date.now(),
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      dateTime: slot,
      status: "Confirmed",
      doctorImage: doctor.image,
    };
    setBookedAppointments([...bookedAppointments, appointment]);
  };

  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadConfirm = () => {
    // Proceed with the download
    window.open(
      "https://github.com/AmyVerse/ayursutra_app/releases/download/APK/ayursutrav8.apk",
      "_self"
    );
    setShowDownloadModal(false);
  };

  if (showDashboard) {
    // Only show patient dashboard here, doctors are redirected to /dashboard
    return (
      <PatientDashboard
        email={mobileOrEmail}
        doctors={doctors}
        bookedAppointments={bookedAppointments}
        onBookAppointment={handleBookAppointment}
        onLogout={() => {
          setShowDashboard(false);
          setShowLoginPage(false);
          setMobileOrEmail("");
          setOtp("");
          setLoginStep("input");
          setIsDoctorSignup(false);
          setHprId("");
          setAbhaId("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative grid-pattern bg-white scroll-smooth">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-4 sm:p-6 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <Image
              src="/ayur.svg"
              alt="AyurSutra Logo"
              width={400}
              height={150}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </div>
          <div className="flex items-center space-x-4 sm:space-x-8">
            <nav className="hidden lg:flex space-x-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </a>
            </nav>
            <button
              onClick={handleDownloadClick}
              className="px-3 py-2 sm:px-4 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white font-inter font-medium rounded-full text-xs sm:text-sm transition-all hover:shadow-lg flex items-center space-x-1 sm:space-x-2"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>Download App</span>
            </button>
          </div>
        </header>

        {/* Hero Section - Full Height */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 text-center max-w-6xl mx-auto min-h-screen flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center flex-1 w-full">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="absolute flex items-start justify-center pointer-events-none">
                <div
                  className="w-[400px] h-[200px] sm:w-[800px] sm:h-[400px] rounded-full blur-3xl"
                  style={{ backgroundColor: "rgba(16, 151, 135, 0.18)" }}
                />
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-montserrat font-bold mb-6 sm:mb-8 leading-tight sm:leading-28">
                Traditional Healing,
                <br />
                <span style={{ color: "rgb(16, 151, 135)" }}>
                  Modern Convenience
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto font-inter leading-relaxed px-2">
                Experience the ancient wisdom of <b>Panchakarma</b> with our
                intelligent scheduling software. Your journey to holistic
                wellness starts here.
              </p>
            </div>

            {/* Call to Action Buttons */}
            {!showLoginPage ? (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4 w-full max-w-md sm:max-w-none">
                <button
                  onClick={handleGetStarted}
                  className="px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-xl text-base sm:text-lg transition-all hover:shadow-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600"
                  style={{ backgroundColor: "rgb(16, 151, 135)" }}
                >
                  Start Your Journey
                </button>
                <button
                  onClick={() => {
                    const aboutSection = document.querySelector("#about");
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 font-semibold rounded-xl text-base sm:text-lg transition-all hover:shadow-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:border-teal-400"
                  style={{
                    borderColor: "rgb(16, 151, 135)",
                    color: "rgb(16, 151, 135)",
                  }}
                >
                  About Panchkarma
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* Login Page Modal */}
        {showLoginPage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <Image
                    src="/ayur.svg"
                    alt="AyurSutra Logo"
                    width={200}
                    height={75}
                    className="h-12 w-auto mx-auto mb-4"
                    priority
                  />
                  <h2 className="text-2xl font-montserrat font-bold text-gray-900 mb-2">
                    {loginStep === "doctor-signup"
                      ? "Doctor Registration"
                      : loginStep === "otp"
                      ? "Verify OTP"
                      : "Welcome to AyurSutra"}
                  </h2>
                  <p className="text-gray-600 font-inter">
                    {loginStep === "doctor-signup"
                      ? "Complete your doctor profile"
                      : loginStep === "otp"
                      ? "Enter the OTP sent to your mobile/email"
                      : "Enter your mobile number or email to continue"}
                  </p>
                </div>

                {/* Step 1: Mobile/Email Input */}
                {loginStep === "input" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number or Email
                      </label>
                      <input
                        type="text"
                        value={mobileOrEmail}
                        onChange={(e) => setMobileOrEmail(e.target.value)}
                        placeholder="Enter mobile number or email"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-inter text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      />
                    </div>

                    <button
                      onClick={handleSendOtp}
                      disabled={!mobileOrEmail}
                      className={`w-full px-6 py-3 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-lg ${
                        mobileOrEmail
                          ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>

                    {/* Doctor Signup Option */}
                    <div className="border-t pt-4">
                      <p className="text-center text-gray-600 text-sm mb-3">
                        Are you a healthcare professional?
                      </p>
                      <button
                        onClick={() => {
                          setIsDoctorSignup(true);
                          setLoginStep("doctor-signup");
                        }}
                        className="w-full px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl text-sm transition-all hover:bg-teal-50"
                      >
                        👨‍⚕️ Sign up as Doctor
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: OTP Verification */}
                {loginStep === "otp" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit OTP"
                        maxLength={6}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-inter focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-center text-lg tracking-widest"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        OTP sent to{" "}
                        <span className="font-medium">{mobileOrEmail}</span>
                      </p>
                      <button className="text-teal-600 hover:text-teal-700 text-sm transition-colors">
                        Resend OTP
                      </button>
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={!otp || otp.length !== 6}
                      className={`w-full px-6 py-3 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-lg ${
                        otp && otp.length === 6
                          ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Verify & Continue
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setLoginStep("input")}
                        className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                      >
                        ← Change Mobile/Email
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Doctor Registration */}
                {loginStep === "doctor-signup" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        HPR ID (Health Professional Registry)
                      </label>
                      <input
                        type="text"
                        value={hprId}
                        onChange={(e) => setHprId(e.target.value)}
                        placeholder="Enter your HPR ID"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-inter text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      />
                    </div>

                    <div className="text-center text-gray-500 text-sm">OR</div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ABHA ID (Ayushman Bharat Health Account)
                      </label>
                      <input
                        type="text"
                        value={abhaId}
                        onChange={(e) => setAbhaId(e.target.value)}
                        placeholder="Enter your ABHA ID"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-inter text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-700 text-sm">
                        💡 We'll fetch your profile details and send OTP to your
                        registered mobile number
                      </p>
                    </div>

                    <button
                      onClick={handleDoctorSignup}
                      disabled={!hprId && !abhaId}
                      className={`w-full px-6 py-3 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-lg ${
                        hprId || abhaId
                          ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Verify & Send OTP
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setLoginStep("input");
                          setIsDoctorSignup(false);
                          setHprId("");
                          setAbhaId("");
                          setMobileOrEmail("");
                        }}
                        className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </div>
                )}

                {/* Back to Home */}
                {loginStep === "input" && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => {
                        setShowLoginPage(false);
                        setMobileOrEmail("");
                        setOtp("");
                        setLoginStep("input");
                        setIsDoctorSignup(false);
                        setHprId("");
                        setAbhaId("");
                      }}
                      className="text-gray-500 hover:text-gray-700 font-inter text-sm transition-colors"
                    >
                      ← Back to Home
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Software Features Section */}
        <section
          id="features"
          className="px-4 sm:px-6 py-16 sm:py-20 bg-gray-50"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-4 sm:mb-6">
              What we are{" "}
              <span style={{ color: "rgb(16, 151, 135)" }}>Offering</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 sm:mb-16 max-w-4xl mx-auto font-inter leading-relaxed px-2">
              Experience seamless healthcare management with AI-powered
              scheduling, intelligent progress tracking, and personalized care
              notifications. Your complete wellness companion for the modern
              age.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:bg-gradient-to-br hover:from-white hover:to-teal-50">
                <h3
                  className="text-xl sm:text-2xl font-montserrat font-bold mb-3 sm:mb-4"
                  style={{ color: "rgb(16, 151, 135)" }}
                >
                  Smart Scheduling
                </h3>
                <p className="text-gray-600 font-inter text-sm sm:text-base">
                  AI-powered scheduling that considers your constitution,
                  availability, and treatment requirements.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:bg-gradient-to-br hover:from-white hover:to-teal-50">
                <h3
                  className="text-xl sm:text-2xl font-montserrat font-bold mb-3 sm:mb-4"
                  style={{ color: "rgb(16, 151, 135)" }}
                >
                  Progress Tracking
                </h3>
                <p className="text-gray-600 font-inter text-sm sm:text-base">
                  Monitor your healing journey with detailed progress reports
                  and personalized recommendations.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:bg-gradient-to-br hover:from-white hover:to-teal-50">
                <h3
                  className="text-xl sm:text-2xl font-montserrat font-bold mb-3 sm:mb-4"
                  style={{ color: "rgb(16, 151, 135)" }}
                >
                  Personalized Notifications
                </h3>
                <p className="text-gray-600 font-inter text-sm sm:text-base">
                  Get intelligent notifications for pre-requirements,
                  post-precautions, and upcoming sessions to ensure optimal
                  treatment outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Panchakarma Information Section */}
        <section
          id="about"
          className="px-4 sm:px-6 py-16 sm:py-20 max-w-6xl mx-auto"
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-4 sm:mb-6">
              What is{" "}
              <span style={{ color: "rgb(16, 151, 135)" }}>Panchakarma</span>?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto font-inter leading-relaxed px-2">
              Panchakarma is Ayurveda's signature detoxification and
              rejuvenation program. This comprehensive system of five
              therapeutic actions purifies the body, mind, and consciousness,
              restoring natural healing ability and inner balance.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Block 1 */}
            <div
              className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:bg-gradient-to-br hover:from-white hover:to-teal-50 border-t-4"
              style={{ borderTopColor: "rgb(16, 151, 135)" }}
            >
              <div
                className="w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: "rgb(16, 151, 135)" }}
              >
                🌿
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-4">
                Deep Detoxification
              </h3>
              <p className="text-gray-600 font-inter leading-relaxed">
                Eliminates toxins at the cellular level, purifying your body's
                natural systems and restoring optimal function.
              </p>
            </div>

            {/* Block 2 */}
            <div
              className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:bg-gradient-to-br hover:from-white hover:to-teal-50 border-t-4"
              style={{ borderTopColor: "rgb(16, 151, 135)" }}
            >
              <div
                className="w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: "rgb(16, 151, 135)" }}
              >
                🧠
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-4">
                Mental Clarity
              </h3>
              <p className="text-gray-600 font-inter leading-relaxed">
                Enhances cognitive function, reduces stress, and promotes
                emotional balance through holistic mind-body healing.
              </p>
            </div>

            {/* Block 3 */}
            <div
              className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:bg-gradient-to-br hover:from-white hover:to-teal-50 border-t-4"
              style={{ borderTopColor: "rgb(16, 151, 135)" }}
            >
              <div
                className="w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: "rgb(16, 151, 135)" }}
              >
                ⚡
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-4">
                Renewed Energy
              </h3>
              <p className="text-gray-600 font-inter leading-relaxed">
                Revitalizes your energy levels, improves sleep quality, and
                boosts overall vitality and life force.
              </p>
            </div>

            {/* Block 4 */}
            <div
              className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:bg-gradient-to-br hover:from-white hover:to-teal-50 border-t-4"
              style={{ borderTopColor: "rgb(16, 151, 135)" }}
            >
              <div
                className="w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: "rgb(16, 151, 135)" }}
              >
                🔄
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-4">
                Immune Boost
              </h3>
              <p className="text-gray-600 font-inter leading-relaxed">
                Strengthens your immune system, increases resistance to disease,
                and promotes long-term health and longevity.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="contact"
          className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-600 bg-white"
        >
          <div className="max-w-6xl mx-auto">
            <div
              className="text-2xl sm:text-3xl font-montserrat font-bold mb-3 sm:mb-4"
              style={{ color: "rgb(16, 151, 135)" }}
            >
              AyurSutra
            </div>
            <p className="font-inter text-sm sm:text-base">
              © 2025 AyurSutra. Bridging ancient wisdom with modern technology.
            </p>
          </div>
        </footer>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDownloadModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: "rgb(16, 151, 135)" }}
                >
                  🛡️
                </div>
              </div>

              <h3 className="text-2xl font-montserrat font-bold text-center mb-4 text-gray-900">
                Safe & Open Source
              </h3>

              <div className="text-center text-md mb-6">
                <p className="text-gray-600 font-inter leading-relaxed mb-4">
                  We've released AyurSutra as <strong>open source</strong> on
                  GitHub! You can review the complete source code to ensure it's
                  completely safe.
                </p>
                <p className="text-gray-600 font-inter leading-relaxed">
                  Click <strong>"Download Anyway"</strong> on the next screen if
                  prompted.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="https://github.com/AmyVerse/ayursutra_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-inter font-medium text-center hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>View Source</span>
                </a>

                <button
                  onClick={handleDownloadConfirm}
                  className="flex-1 px-3 py-2 text-white rounded-xl font-inter font-medium text-center transition-all hover:shadow-lg flex items-center justify-center space-x-2"
                  style={{ backgroundColor: "rgb(16, 151, 135)" }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download</span>
                </button>
              </div>

              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-inter text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
