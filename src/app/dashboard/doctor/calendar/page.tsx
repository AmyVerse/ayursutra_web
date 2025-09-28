import Link from "next/link";

export default function Calendar() {
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];

  const appointments = [
    {
      id: 1,
      time: "9:00 AM",
      patient: "Ravi Kumar",
      treatment: "Abhyanga",
      duration: 60,
      day: 23,
    },
    {
      id: 2,
      time: "11:30 AM",
      patient: "Priya Sharma",
      treatment: "Shirodhara",
      duration: 90,
      day: 23,
    },
    {
      id: 3,
      time: "2:00 PM",
      patient: "Anjali Jain",
      treatment: "Consultation",
      duration: 30,
      day: 23,
    },
    {
      id: 4,
      time: "10:00 AM",
      patient: "Suresh Reddy",
      treatment: "Kati Basti",
      duration: 45,
      day: 24,
    },
    {
      id: 5,
      time: "3:30 PM",
      patient: "Meera Patel",
      treatment: "Udvartana",
      duration: 75,
      day: 24,
    },
    {
      id: 6,
      time: "9:30 AM",
      patient: "Rohit Singh",
      treatment: "Abhyanga",
      duration: 60,
      day: 25,
    },
  ];

  const getDaysInMonth = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getAppointmentsForDay = (day: number) => {
    return appointments.filter((apt) => apt.day === day);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

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
                className="text-teal-600 hover:text-teal-800 font-inter"
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
              Calendar & Time Slots
            </h2>
            <p className="text-gray-600 font-inter">
              Manage appointments and view available time slots
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-teal-500">
              <option>Day View</option>
              <option>Week View</option>
              <option selected>Month View</option>
            </select>
            <Link
              href="/dashboard/appointments/new"
              className="px-6 py-3 bg-teal-600 text-white font-inter font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              New Appointment
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-montserrat font-semibold text-gray-900">
                {currentMonth} {currentYear}
              </h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-montserrat font-semibold text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, index) => {
                const dayAppointments = day ? getAppointmentsForDay(day) : [];
                const isToday = day === today.getDate();

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-gray-200 ${
                      day ? "hover:bg-gray-50 cursor-pointer" : ""
                    } ${isToday ? "bg-teal-50 border-teal-200" : ""}`}
                  >
                    {day && (
                      <>
                        <div
                          className={`text-sm font-inter font-medium mb-2 ${
                            isToday ? "text-teal-700" : "text-gray-900"
                          }`}
                        >
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 2).map((apt) => (
                            <div
                              key={apt.id}
                              className="text-xs p-1 bg-teal-100 text-teal-800 rounded font-inter truncate"
                              title={`${apt.time} - ${apt.patient}`}
                            >
                              {apt.time} {apt.patient.split(" ")[0]}
                            </div>
                          ))}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-gray-500 font-inter">
                              +{dayAppointments.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {getAppointmentsForDay(23).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-teal-50 rounded-lg border-l-4 border-teal-500"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-inter font-semibold text-teal-700">
                      {apt.time}
                    </span>
                    <span className="text-xs text-gray-600 font-inter">
                      {apt.duration} min
                    </span>
                  </div>
                  <div className="text-sm font-inter text-gray-900">
                    {apt.patient}
                  </div>
                  <div className="text-xs text-gray-600 font-inter">
                    {apt.treatment}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-montserrat font-semibold text-gray-900 mb-3">
                Available Slots Today
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {["10:30 AM", "12:30 PM", "4:30 PM", "5:30 PM"].map((slot) => (
                  <button
                    key={slot}
                    className="p-2 text-xs border border-gray-300 rounded hover:bg-teal-50 hover:border-teal-300 font-inter"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-montserrat font-semibold text-gray-900 mb-3">
                Treatment Rooms
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-inter text-gray-700">
                    Room 1 - Abhyanga
                  </span>
                  <span
                    className="w-3 h-3 bg-green-500 rounded-full"
                    title="Available"
                  ></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-inter text-gray-700">
                    Room 2 - Shirodhara
                  </span>
                  <span
                    className="w-3 h-3 bg-red-500 rounded-full"
                    title="Occupied"
                  ></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-inter text-gray-700">
                    Room 3 - Consultation
                  </span>
                  <span
                    className="w-3 h-3 bg-green-500 rounded-full"
                    title="Available"
                  ></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-inter text-gray-700">
                    Room 4 - Steam Bath
                  </span>
                  <span
                    className="w-3 h-3 bg-yellow-500 rounded-full"
                    title="Cleaning"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-inter text-gray-600">Today</p>
                <p className="text-xl font-montserrat font-bold text-gray-900">
                  12 appointments
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">This Week</p>
                <p className="text-xl font-montserrat font-bold text-gray-900">
                  67 appointments
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
                  Available Slots
                </p>
                <p className="text-xl font-montserrat font-bold text-gray-900">
                  24 slots
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-inter text-gray-600">
                  Rooms Available
                </p>
                <p className="text-xl font-montserrat font-bold text-gray-900">
                  2 of 4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
