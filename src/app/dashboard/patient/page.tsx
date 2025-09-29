"use client";

import NotificationIcon from "@/components/NotificationIcon";

export default function PatientDashboard() {
  return (
    <>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Your wellness journey starts here
              </p>
            </div>

            <div className="flex items-center justify-end sm:justify-start space-x-3 sm:space-x-4">
              <NotificationIcon />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Message */}
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <div className="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">
            🙏
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome to AyurSutra
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Your journey to holistic wellness starts here. Find qualified
            Ayurvedic doctors and book appointments easily.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-2xl mx-auto">
            <a
              href="/dashboard/patient/find-doctors"
              className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow text-left block"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👩‍⚕️</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Find Doctors
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Search and book appointments with qualified Ayurvedic
                practitioners
              </p>
              <div className="mt-2 sm:mt-3 text-emerald-600 text-xs sm:text-sm font-medium">
                Search now →
              </div>
            </a>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Appointments
              </h3>
              <p className="text-gray-600 text-sm">
                View and manage your upcoming appointments
              </p>
              <div className="mt-3 text-gray-400 text-sm">Coming soon</div>
            </div>
          </div>

          {/* IVR Link */}
          <div className="bg-teal-50 border-l-4 border-teal-400 p-3 sm:p-4 mt-6 sm:mt-8 rounded-r-lg max-w-2xl mx-auto">
            <div className="flex items-start sm:items-center">
              <div className="flex-shrink-0">
                <span className="text-teal-400 text-xl sm:text-2xl">📋</span>
              </div>
              <div className="ml-3 text-left">
                <p className="text-xs sm:text-sm text-teal-700">
                  Complete your initial health assessment before booking
                  appointments
                </p>
                <a
                  href="https://ayurvedic-dosha-diagnosis1.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-500 font-medium text-xs sm:text-sm underline mt-1 inline-block"
                >
                  Fill the IVR Initial Vital Report →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
