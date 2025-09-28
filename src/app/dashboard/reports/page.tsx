import Link from "next/link";

export default function Reports() {
  const reports = [
    {
      id: 1,
      patientName: "Ravi Kumar",
      patientId: "RK001",
      reportDate: "2025-09-20",
      reportType: "Progress Report",
      treatment: "Abhyanga + Swedana",
      sessionNumber: 5,
      totalSessions: 10,
      improvement: "Significant",
      nextSession: "2025-09-25",
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      patientId: "PS002",
      reportDate: "2025-09-18",
      reportType: "Initial Assessment",
      treatment: "Shirodhara",
      sessionNumber: 1,
      totalSessions: 8,
      improvement: "Starting",
      nextSession: "2025-09-24",
    },
    {
      id: 3,
      patientName: "Anjali Jain",
      patientId: "AJ003",
      reportDate: "2025-09-15",
      reportType: "Final Report",
      treatment: "Complete Panchakarma",
      sessionNumber: 21,
      totalSessions: 21,
      improvement: "Excellent",
      nextSession: "Follow-up in 3 months",
    },
  ];

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
                className="text-teal-600 hover:text-teal-800 font-inter"
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
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
              Patient Reports
            </h2>
            <p className="text-gray-600 font-inter">
              Generate and manage patient treatment reports
            </p>
          </div>
          <Link
            href="/dashboard/reports/new"
            className="px-6 py-3 bg-teal-600 text-white font-inter font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Generate New Report
          </Link>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Total Reports
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  247
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
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
                  Completed Treatments
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  89
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">Success Rate</p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  94%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Avg. Treatment Duration
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  14 days
                </p>
              </div>
            </div>
          </div>
        </div>

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
                placeholder="Search patient reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-inter"
              />
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-teal-500">
                <option>All Report Types</option>
                <option>Initial Assessment</option>
                <option>Progress Report</option>
                <option>Final Report</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-teal-500">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Treatment Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Improvement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Report Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-inter font-semibold">
                            {report.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-inter font-medium text-gray-900">
                            {report.patientName}
                          </div>
                          <div className="text-sm text-gray-500 font-inter">
                            ID: {report.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-inter font-semibold rounded-full ${
                          report.reportType === "Initial Assessment"
                            ? "bg-blue-100 text-blue-800"
                            : report.reportType === "Progress Report"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-inter">
                        {report.treatment}
                      </div>
                      <div className="text-sm text-gray-500 font-inter">
                        Session {report.sessionNumber} of {report.totalSessions}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-teal-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (report.sessionNumber / report.totalSessions) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs font-inter font-semibold rounded-full ${
                          report.improvement === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : report.improvement === "Significant"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {report.improvement}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-inter">
                      {report.reportDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/reports/${report.id}/view`}
                          className="text-teal-600 hover:text-teal-900 font-inter"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/reports/${report.id}/download`}
                          className="text-blue-600 hover:text-blue-900 font-inter"
                        >
                          Download
                        </Link>
                        <Link
                          href={`/dashboard/reports/${report.id}/print`}
                          className="text-green-600 hover:text-green-900 font-inter"
                        >
                          Print
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Templates */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
            Report Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors">
              <h4 className="font-inter font-semibold text-gray-900 mb-2">
                Initial Assessment Template
              </h4>
              <p className="text-sm text-gray-600 font-inter mb-3">
                Comprehensive evaluation form for new patients including
                Prakriti analysis
              </p>
              <button className="text-teal-600 hover:text-teal-800 text-sm font-inter">
                Use Template →
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors">
              <h4 className="font-inter font-semibold text-gray-900 mb-2">
                Progress Report Template
              </h4>
              <p className="text-sm text-gray-600 font-inter mb-3">
                Track patient improvement throughout Panchakarma treatment
                sessions
              </p>
              <button className="text-teal-600 hover:text-teal-800 text-sm font-inter">
                Use Template →
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors">
              <h4 className="font-inter font-semibold text-gray-900 mb-2">
                Discharge Summary Template
              </h4>
              <p className="text-sm text-gray-600 font-inter mb-3">
                Final report with recommendations and follow-up care
                instructions
              </p>
              <button className="text-teal-600 hover:text-teal-800 text-sm font-inter">
                Use Template →
              </button>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
              Treatment Success Rate
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-inter text-gray-700">
                    Abhyanga
                  </span>
                  <span className="text-sm font-inter text-gray-900">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: "96%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-inter text-gray-700">
                    Shirodhara
                  </span>
                  <span className="text-sm font-inter text-gray-900">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-inter text-gray-700">
                    Swedana
                  </span>
                  <span className="text-sm font-inter text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
              Popular Treatments This Month
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                <span className="font-inter text-gray-900">Abhyanga</span>
                <span className="font-inter font-semibold text-teal-600">
                  45 treatments
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-inter text-gray-900">Shirodhara</span>
                <span className="font-inter font-semibold text-blue-600">
                  32 treatments
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-inter text-gray-900">Swedana</span>
                <span className="font-inter font-semibold text-green-600">
                  28 treatments
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-inter text-gray-900">Consultation</span>
                <span className="font-inter font-semibold text-orange-600">
                  67 sessions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
