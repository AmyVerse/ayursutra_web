"use client";

import DoctorSearch from "@/components/DoctorSearch";
import NotificationIcon from "@/components/NotificationIcon";

export default function FindDoctorsPage() {
  return (
    <>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
              <p className="text-sm text-gray-600 mt-1">
                Discover qualified Ayurvedic practitioners
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationIcon />

              {/* Quick Action */}
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Advanced Search
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <DoctorSearch patientAyursutraId="AS-P-12345" />
      </main>
    </>
  );
}
