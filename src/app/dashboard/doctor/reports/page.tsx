export default function Reports() {
  const reports = [
    {
      id: 1,
      patientName: "Ravi Kumar",
      patientId: "RK001",
      reportDate: "2025-09-20",
      reportType: "Progress Report",
      treatment: "Abhyanga + Swedana",
      improvement: "Significant",
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      patientId: "PS002",
      reportDate: "2025-09-18",
      reportType: "Initial Assessment",
      treatment: "Shirodhara",
      improvement: "Starting",
    },
    {
      id: 3,
      patientName: "Anjali Jain",
      patientId: "AJ003",
      reportDate: "2025-09-15",
      reportType: "Final Report",
      treatment: "Complete Panchakarma",
      improvement: "Excellent",
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-600 mt-1">
                Patient treatment reports and analytics
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">247</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">14</div>
            <div className="text-sm text-gray-600">Avg Days</div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Reports
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-emerald-700">
                        {report.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {report.patientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {report.patientId} • {report.reportType}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      {report.treatment}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.reportDate}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        report.improvement === "Excellent"
                          ? "bg-green-100 text-green-800"
                          : report.improvement === "Significant"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {report.improvement}
                    </span>

                    <div className="flex space-x-2">
                      <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                        View
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
            Generate New Report
          </button>
        </div>
      </div>
    </>
  );
}
