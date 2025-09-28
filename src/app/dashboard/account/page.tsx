import Link from "next/link";

export default function Account() {
  const profileData = {
    name: "Dr. Arun Sharma",
    title: "Ayurvedic Physician & Panchakarma Specialist",
    email: "dr.arun@ayursutra.com",
    phone: "+91 98765 43210",
    license: "AYU-DEL-2018-456789",
    experience: "12 years",
    specialization: ["Panchakarma", "Abhyanga", "Shirodhara", "Swedana"],
    clinic: "Vedic Wellness Center",
    address: "45, Green Park, New Delhi - 110016",
    joinedDate: "March 2020",
    totalPatients: 1247,
    successfulTreatments: 1089,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-2xl font-montserrat font-bold"
                style={{ color: "rgb(16, 151, 135)" }}
              >
                AyurSutra Dashboard
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800 font-inter"
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
                className="text-teal-600 hover:text-teal-800 font-inter"
              >
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
            My Account
          </h2>
          <p className="text-gray-600 font-inter">
            Manage your profile and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-montserrat font-semibold text-gray-900">
                  Profile Information
                </h3>
                <button className="px-4 py-2 bg-teal-600 text-white font-inter font-medium rounded-lg hover:bg-teal-700 transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="flex items-center mb-8">
                <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-white font-montserrat font-bold">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="ml-6">
                  <h4 className="text-2xl font-montserrat font-bold text-gray-900">
                    {profileData.name}
                  </h4>
                  <p className="text-teal-600 font-inter font-medium mb-2">
                    {profileData.title}
                  </p>
                  <p className="text-gray-500 font-inter text-sm">
                    Practicing Ayurveda since{" "}
                    {2025 - parseInt(profileData.experience)} •{" "}
                    {profileData.experience} experience
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-inter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-inter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                    Medical License
                  </label>
                  <input
                    type="text"
                    value={profileData.license}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-inter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={profileData.experience}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-inter"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-inter font-medium rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    value={profileData.clinic}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-inter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-inter"
                  />
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-6">
                Account Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-montserrat font-bold text-teal-600 mb-2">
                    {profileData.totalPatients.toLocaleString()}
                  </div>
                  <div className="text-gray-600 font-inter">
                    Total Patients Treated
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-montserrat font-bold text-green-600 mb-2">
                    {profileData.successfulTreatments.toLocaleString()}
                  </div>
                  <div className="text-gray-600 font-inter">
                    Successful Treatments
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-montserrat font-bold text-blue-600 mb-2">
                    {Math.round(
                      (profileData.successfulTreatments /
                        profileData.totalPatients) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-gray-600 font-inter">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-teal-50 text-teal-700 font-inter font-medium rounded-lg hover:bg-teal-100 transition-colors text-left">
                  Change Password
                </button>
                <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-inter font-medium rounded-lg hover:bg-blue-100 transition-colors text-left">
                  Update Profile Photo
                </button>
                <button className="w-full px-4 py-3 bg-green-50 text-green-700 font-inter font-medium rounded-lg hover:bg-green-100 transition-colors text-left">
                  Download Certificate
                </button>
                <button className="w-full px-4 py-3 bg-orange-50 text-orange-700 font-inter font-medium rounded-lg hover:bg-orange-100 transition-colors text-left">
                  Export Patient Data
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-gray-700">
                    Email Notifications
                  </span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-gray-700">
                    SMS Reminders
                  </span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-gray-700">Auto Backup</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-gray-700">
                    Two-Factor Auth
                  </span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
                Subscription Plan
              </h3>
              <div className="border border-teal-200 rounded-lg p-4 bg-teal-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter font-semibold text-teal-900">
                    Professional Plan
                  </span>
                  <span className="px-2 py-1 bg-teal-200 text-teal-800 text-xs font-inter rounded">
                    Active
                  </span>
                </div>
                <p className="text-sm text-teal-700 font-inter mb-3">
                  Unlimited patients • Advanced reports • Priority support
                </p>
                <div className="text-sm text-gray-600 font-inter">
                  Next billing: October 15, 2025
                </div>
                <div className="text-lg font-montserrat font-bold text-teal-900 mb-3">
                  ₹2,999/month
                </div>
                <button className="w-full px-4 py-2 bg-teal-600 text-white font-inter font-medium rounded-lg hover:bg-teal-700 transition-colors">
                  Manage Subscription
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-inter text-gray-600">
                    Profile updated
                  </span>
                  <span className="ml-auto text-gray-400 font-inter">
                    2h ago
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-inter text-gray-600">
                    Password changed
                  </span>
                  <span className="ml-auto text-gray-400 font-inter">
                    1d ago
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="font-inter text-gray-600">
                    Data exported
                  </span>
                  <span className="ml-auto text-gray-400 font-inter">
                    3d ago
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  <span className="font-inter text-gray-600">
                    Certificate renewed
                  </span>
                  <span className="ml-auto text-gray-400 font-inter">
                    1w ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
