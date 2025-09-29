"use client";

import NotificationIcon from "@/components/NotificationIcon";
import Link from "next/link";

export default function Patients() {
  const patients = [
    {
      id: 1,
      name: "Ravi Kumar",
      age: 45,
      phone: "+91 98765 43210",
      lastVisit: "2025-09-20",
      condition: "Arthritis, Anxiety",
      prakriti: "Vata-Pitta",
      activeTreatment: "Abhyanga + Swedana",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Sharma",
      age: 38,
      phone: "+91 87654 32109",
      lastVisit: "2025-09-18",
      condition: "Migraine, Insomnia",
      prakriti: "Pitta-Kapha",
      activeTreatment: "Shirodhara",
      status: "Active",
    },
    {
      id: 3,
      name: "Anjali Jain",
      age: 52,
      phone: "+91 76543 21098",
      lastVisit: "2025-09-15",
      condition: "Diabetes, Hypertension",
      prakriti: "Kapha-Vata",
      activeTreatment: "Consultation",
      status: "Completed",
    },
    {
      id: 4,
      name: "Suresh Reddy",
      age: 41,
      phone: "+91 65432 10987",
      lastVisit: "2025-09-22",
      condition: "Lower back pain",
      prakriti: "Vata",
      activeTreatment: "Kati Basti",
      status: "Active",
    },
    {
      id: 5,
      name: "Meera Patel",
      age: 29,
      phone: "+91 54321 09876",
      lastVisit: "2025-09-19",
      condition: "PCOS, Stress",
      prakriti: "Pitta",
      activeTreatment: "Udvartana",
      status: "Active",
    },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your patient records and treatments
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationIcon />

              <Link
                href="/dashboard/doctor/patients/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Patient
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-inter"
              />
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-teal-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-teal-500">
                <option>All Prakriti</option>
                <option>Vata</option>
                <option>Pitta</option>
                <option>Kapha</option>
                <option>Vata-Pitta</option>
                <option>Pitta-Kapha</option>
                <option>Kapha-Vata</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Condition & Prakriti
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Active Treatment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-inter font-semibold">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-inter font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500 font-inter">
                            Age: {patient.age} years
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-inter">
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-inter">
                        {patient.condition}
                      </div>
                      <div className="text-sm text-teal-600 font-inter font-semibold">
                        Prakriti: {patient.prakriti}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-inter font-semibold rounded-full bg-blue-100 text-blue-800">
                        {patient.activeTreatment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-inter">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs font-inter font-semibold rounded-full ${
                          patient.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/patients/${patient.id}`}
                          className="text-teal-600 hover:text-teal-900 font-inter"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/patients/${patient.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 font-inter"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/dashboard/reports/${patient.id}`}
                          className="text-green-600 hover:text-green-900 font-inter"
                        >
                          Reports
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700 font-inter">
            Showing 1 to 5 of 247 patients
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-inter hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-inter">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-inter hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-inter hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-inter hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
