"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const [showLoginPage, setShowLoginPage] = useState(false);
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [loginStep, setLoginStep] = useState("input"); // "input", "otp", "doctor-signup"
  const [isDoctorSignup, setIsDoctorSignup] = useState(false);
  const [hprId, setHprId] = useState("");
  const [abhaId, setAbhaId] = useState("");

  // Hardcoded doctors data

  const handleGetStarted = () => {
    if (session) {
      // User is logged in, go to dashboard
      router.push("/dashboard");
    } else {
      // User not logged in, show login page
      setShowLoginPage(true);
    }
  };

  const handleSendOtp = async () => {
    if (mobileOrEmail) {
      try {
        const response = await fetch("/api/otp/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: mobileOrEmail,
          }),
        });

        if (response.ok) {
          setLoginStep("otp");
        } else {
          alert("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP. Please try again.");
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp) {
      try {
        const response = await fetch("/api/otp/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: mobileOrEmail,
            otp: otp,
            isDoctor: isDoctorSignup,
            hprId: hprId || undefined,
            abhaId: abhaId || undefined,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Sign in with NextAuth using the user ID
          const result = await signIn("otp", {
            userId: data.userId.toString(),
            redirect: false,
          });

          if (result?.ok) {
            // Use the redirectUrl from API response
            window.location.href = data.redirectUrl;
          } else {
            alert("Authentication failed. Please try again.");
          }
        } else {
          alert(data.error || "Invalid OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Failed to verify OTP. Please try again.");
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

  // Remove old dashboard logic - using proper routing now

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
                  {session ? "Go to Dashboard" : "Start Your Journey"}
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
