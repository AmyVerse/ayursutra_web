import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1
                className="text-2xl font-montserrat font-bold"
                style={{ color: "rgb(16, 151, 135)" }}
              >
                AyurSutra Dashboard
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/dashboard"
                className="text-teal-600 hover:text-teal-800 font-inter"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/appointments"
                className="text-gray-600 hover:text-gray-800 font-inter"
              >
                Appointments
              </Link>
              <Link
                href="/dashboard/patients"
                className="text-gray-600 hover:text-gray-800 font-inter"
              >
                Patients
              </Link>
              <Link
                href="/dashboard/calendar"
                className="text-gray-600 hover:text-gray-800 font-inter"
              >
                Calendar
              </Link>
              <Link
                href="/dashboard/reports"
                className="text-gray-600 hover:text-gray-800 font-inter"
              >
                Reports
              </Link>
              <Link
                href="/dashboard/account"
                className="text-gray-600 hover:text-gray-800 font-inter"
              >
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
            Namaste, Dr. Sharma 🙏
          </h2>
          <p className="text-gray-600 font-inter">
            Welcome to your Panchakarma practice dashboard
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-100">
                <svg
                  className="w-6 h-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  247
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  12
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Active Therapies
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  89
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  ₹2,45,000
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-montserrat font-semibold text-gray-900">
                Today's Appointments
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-inter font-semibold">
                        RK
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-inter font-medium text-gray-900">
                        Ravi Kumar
                      </p>
                      <p className="text-sm text-gray-600 font-inter">
                        Abhyanga + Swedana
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-inter text-teal-600">
                    9:00 AM
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-inter font-semibold">
                        PS
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-inter font-medium text-gray-900">
                        Priya Sharma
                      </p>
                      <p className="text-sm text-gray-600 font-inter">
                        Shirodhara
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-inter text-blue-600">
                    11:30 AM
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-inter font-semibold">
                        AJ
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-inter font-medium text-gray-900">
                        Anjali Jain
                      </p>
                      <p className="text-sm text-gray-600 font-inter">
                        Consultation
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-inter text-green-600">
                    2:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-montserrat font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/dashboard/appointments/new"
                  className="p-4 border-2 border-dashed border-teal-300 rounded-lg hover:border-teal-500 transition-colors text-center"
                >
                  <svg
                    className="w-8 h-8 text-teal-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-sm font-inter text-teal-600">
                    New Appointment
                  </p>
                </Link>

                <Link
                  href="/dashboard/patients/new"
                  className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 transition-colors text-center"
                >
                  <svg
                    className="w-8 h-8 text-blue-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="text-sm font-inter text-blue-600">
                    Add Patient
                  </p>
                </Link>

                <Link
                  href="/dashboard/reports/new"
                  className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 transition-colors text-center"
                >
                  <svg
                    className="w-8 h-8 text-green-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm font-inter text-green-600">
                    Generate Report
                  </p>
                </Link>

                <Link
                  href="/dashboard/calendar"
                  className="p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 transition-colors text-center"
                >
                  <svg
                    className="w-8 h-8 text-orange-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm font-inter text-orange-600">
                    View Calendar
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Panchakarma Treatments Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-montserrat font-semibold text-gray-900">
              Popular Panchakarma Treatments
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                <div className="w-16 h-16 bg-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <h4 className="font-montserrat font-semibold text-gray-900 mb-2">
                  Abhyanga
                </h4>
                <p className="text-sm text-gray-600 font-inter">
                  Full body oil massage
                </p>
                <p className="text-teal-600 font-inter font-semibold mt-2">
                  ₹2,500
                </p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💧</span>
                </div>
                <h4 className="font-montserrat font-semibold text-gray-900 mb-2">
                  Shirodhara
                </h4>
                <p className="text-sm text-gray-600 font-inter">
                  Oil pouring therapy
                </p>
                <p className="text-blue-600 font-inter font-semibold mt-2">
                  ₹3,000
                </p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <h4 className="font-montserrat font-semibold text-gray-900 mb-2">
                  Swedana
                </h4>
                <p className="text-sm text-gray-600 font-inter">
                  Herbal steam therapy
                </p>
                <p className="text-green-600 font-inter font-semibold mt-2">
                  ₹1,800
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
