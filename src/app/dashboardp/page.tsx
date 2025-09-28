"use client";
import Image from "next/image";
import { useState } from "react";

export default function PatientDashboard() {
  const [selectedTab, setSelectedTab] = useState("find-doctors");
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);

  // Get email from URL params or local storage (you can implement this as needed)
  const email = "patient@example.com"; // This should come from authentication

  // Hardcoded doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      specialization: "Panchakarma Specialist",
      experience: "15 years",
      rating: 4.8,
      availableSlots: [
        "2025-09-25 10:00",
        "2025-09-25 14:00",
        "2025-09-26 09:00",
        "2025-09-27 11:00",
      ],
      image: "👨‍⚕️",
      location: "Mumbai, Maharashtra",
    },
    {
      id: 2,
      name: "Dr. Priya Nair",
      specialization: "Ayurvedic Physician",
      experience: "12 years",
      rating: 4.9,
      availableSlots: [
        "2025-09-25 11:00",
        "2025-09-25 15:00",
        "2025-09-26 10:00",
        "2025-09-27 14:00",
      ],
      image: "👩‍⚕️",
      location: "Kerala, India",
    },
    {
      id: 3,
      name: "Dr. Arjun Patel",
      specialization: "Herbal Medicine Expert",
      experience: "20 years",
      rating: 4.7,
      availableSlots: [
        "2025-09-25 12:00",
        "2025-09-25 16:00",
        "2025-09-26 11:00",
        "2025-09-27 15:00",
      ],
      image: "👨‍⚕️",
      location: "Gujarat, India",
    },
    {
      id: 4,
      name: "Dr. Meera Singh",
      specialization: "Women's Ayurvedic Health",
      experience: "18 years",
      rating: 4.9,
      availableSlots: [
        "2025-09-25 13:00",
        "2025-09-25 17:00",
        "2025-09-26 12:00",
        "2025-09-27 16:00",
      ],
      image: "👩‍⚕️",
      location: "Delhi, India",
    },
  ];

  const handleBookAppointment = (doctor: any, slot: string) => {
    const appointment = {
      id: Date.now(),
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      dateTime: slot,
      status: "Confirmed",
      doctorImage: doctor.image,
    };
    setBookedAppointments([...bookedAppointments, appointment]);
  };

  const handleLogout = () => {
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/ayur.svg"
                alt="AyurSutra Logo"
                width={200}
                height={75}
                className="h-8 w-auto"
                priority
              />
              <span className="ml-3 text-gray-600">Patient Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setSelectedTab("find-doctors")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "find-doctors"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Find Doctors
          </button>
          <button
            onClick={() => setSelectedTab("appointments")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === "appointments"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Appointments
          </button>
        </div>

        {selectedTab === "find-doctors" && (
          <div>
            {/* IVR Link */}
            <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-teal-400 text-2xl">📋</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-teal-700">
                    Before booking an appointment, please complete your initial
                    health assessment.
                  </p>
                  <a
                    href="#"
                    className="text-teal-600 hover:text-teal-500 font-medium text-sm underline mt-1 inline-block"
                  >
                    Fill the IVR Initial Vital Report →
                  </a>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor: any) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">{doctor.image}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-teal-600 font-medium">
                          {doctor.specialization}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doctor.experience} • {doctor.location}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {doctor.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Available Slots:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {doctor.availableSlots
                          .slice(0, 4)
                          .map((slot: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() =>
                                handleBookAppointment(doctor, slot)
                              }
                              className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs rounded-lg transition-colors border border-teal-200"
                            >
                              {new Date(slot).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Appointments
            </h2>
            {bookedAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500">No appointments booked yet</p>
                <button
                  onClick={() => setSelectedTab("find-doctors")}
                  className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Find Doctors
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookedAppointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-xl shadow-sm border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">
                          {appointment.doctorImage}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-teal-600">
                            {appointment.doctorSpecialization}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.dateTime).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
