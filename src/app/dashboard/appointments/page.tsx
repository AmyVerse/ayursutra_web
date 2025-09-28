import Link from "next/link";

export default function Appointments() {
  const appointments = [
    {
      id: 1,
      patient: "Ravi Kumar",
      patientId: "RK001",
      time: "9:00 AM",
      date: "2025-09-23",
      treatment: "Abhyanga",
      duration: 60,
      status: "Confirmed",
      room: "Treatment Room 1",
      contact: "+91 98765 43210",
      prakriti: "Vata-Pitta",
    },
    {
      id: 2,
      patient: "Priya Sharma",
      patientId: "PS002",
      time: "11:30 AM",
      date: "2025-09-23",
      treatment: "Shirodhara",
      duration: 90,
      status: "Confirmed",
      room: "Treatment Room 2",
      contact: "+91 98765 43211",
      prakriti: "Pitta-Kapha",
    },
    {
      id: 3,
      patient: "Anjali Jain",
      patientId: "AJ003",
      time: "2:00 PM",
      date: "2025-09-23",
      treatment: "Consultation",
      duration: 30,
      status: "Pending",
      room: "Consultation Room",
      contact: "+91 98765 43212",
      prakriti: "Kapha-Vata",
    },
    {
      id: 4,
      patient: "Suresh Reddy",
      patientId: "SR004",
      time: "10:00 AM",
      date: "2025-09-24",
      treatment: "Kati Basti",
      duration: 45,
      status: "Confirmed",
      room: "Treatment Room 3",
      contact: "+91 98765 43213",
      prakriti: "Vata-Kapha",
    },
    {
      id: 5,
      patient: "Meera Patel",
      patientId: "MP005",
      time: "3:30 PM",
      date: "2025-09-24",
      treatment: "Udvartana",
      duration: 75,
      status: "Rescheduled",
      room: "Treatment Room 1",
      contact: "+91 98765 43214",
      prakriti: "Pitta-Vata",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rescheduled":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const todaysAppointments = appointments.filter(
    (apt) => apt.date === "2025-09-23"
  );
  const upcomingAppointments = appointments.filter(
    (apt) => apt.date > "2025-09-23"
  );

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
                className="text-teal-600 hover:text-teal-800 font-inter"
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
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
              Appointments
            </h2>
            <p className="text-gray-600 font-inter">
              Manage your Panchakarma appointments and sessions
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/appointments/new"
              className="px-6 py-3 bg-teal-600 text-white font-inter font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Book New Appointment
            </Link>
            <Link
              href="/dashboard/calendar"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-inter font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Calendar View
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  {todaysAppointments.length}
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
                <p className="text-sm font-inter text-gray-600">Confirmed</p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  {
                    appointments.filter((apt) => apt.status === "Confirmed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
                <p className="text-sm font-inter text-gray-600">Pending</p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  {
                    appointments.filter((apt) => apt.status === "Pending")
                      .length
                  }
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Total This Week
                </p>
                <p className="text-2xl font-montserrat font-bold text-gray-900">
                  12
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="mb-8">
          <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-4">
            Today's Appointments - September 23, 2025
          </h3>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {todaysAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-montserrat font-semibold text-gray-900">
                      {appointment.time}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-inter font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-inter font-semibold text-sm">
                          {appointment.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="font-inter font-semibold text-gray-900">
                          {appointment.patient}
                        </p>
                        <p className="text-sm text-gray-600 font-inter">
                          ID: {appointment.patientId}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-2">
                      <p className="text-sm font-inter text-gray-700">
                        <span className="font-medium">Treatment:</span>{" "}
                        {appointment.treatment}
                      </p>
                      <p className="text-sm font-inter text-gray-700">
                        <span className="font-medium">Duration:</span>{" "}
                        {appointment.duration} mins
                      </p>
                      <p className="text-sm font-inter text-gray-700">
                        <span className="font-medium">Room:</span>{" "}
                        {appointment.room}
                      </p>
                      <p className="text-sm font-inter text-gray-700">
                        <span className="font-medium">Prakriti:</span>{" "}
                        {appointment.prakriti}
                      </p>
                    </div>

                    <div className="flex justify-between pt-3">
                      <button className="px-3 py-1 bg-teal-50 text-teal-600 text-sm font-inter font-medium rounded hover:bg-teal-100 transition-colors">
                        Start Session
                      </button>
                      <button className="px-3 py-1 bg-gray-50 text-gray-600 text-sm font-inter font-medium rounded hover:bg-gray-100 transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-montserrat font-semibold text-gray-900">
              Upcoming Appointments
            </h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg font-inter text-sm focus:ring-2 focus:ring-teal-500">
                <option>All Treatments</option>
                <option>Abhyanga</option>
                <option>Shirodhara</option>
                <option>Consultation</option>
                <option>Kati Basti</option>
                <option>Udvartana</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg font-inter text-sm focus:ring-2 focus:ring-teal-500">
                <option>Next 7 Days</option>
                <option>Next 2 Weeks</option>
                <option>Next Month</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                      Treatment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">
                      Room
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
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-inter font-semibold">
                              {appointment.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-inter font-medium text-gray-900">
                              {appointment.patient}
                            </div>
                            <div className="text-sm text-gray-500 font-inter">
                              {appointment.prakriti}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-inter text-gray-900">
                          {appointment.date}
                        </div>
                        <div className="text-sm text-gray-500 font-inter">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-inter">
                          {appointment.treatment}
                        </div>
                        <div className="text-sm text-gray-500 font-inter">
                          {appointment.duration} minutes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-inter">
                        {appointment.room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs font-inter font-semibold rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/appointments/${appointment.id}`}
                            className="text-teal-600 hover:text-teal-900 font-inter"
                          >
                            Edit
                          </Link>
                          <button className="text-blue-600 hover:text-blue-900 font-inter">
                            Reschedule
                          </button>
                          <button className="text-red-600 hover:text-red-900 font-inter">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Treatment Room Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
            Treatment Room Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-inter font-semibold text-green-900">
                  Treatment Room 1
                </h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-inter rounded">
                  Available
                </span>
              </div>
              <p className="text-sm text-green-700 font-inter mt-2">
                Next: 3:30 PM - Meera Patel
              </p>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-inter font-semibold text-red-900">
                  Treatment Room 2
                </h4>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-inter rounded">
                  Occupied
                </span>
              </div>
              <p className="text-sm text-red-700 font-inter mt-2">
                Current: Shirodhara Session
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-inter font-semibold text-yellow-900">
                  Treatment Room 3
                </h4>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-inter rounded">
                  Cleaning
                </span>
              </div>
              <p className="text-sm text-yellow-700 font-inter mt-2">
                Available in 15 minutes
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-inter font-semibold text-blue-900">
                  Consultation Room
                </h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-inter rounded">
                  Available
                </span>
              </div>
              <p className="text-sm text-blue-700 font-inter mt-2">
                Ready for appointments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
