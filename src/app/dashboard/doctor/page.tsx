"use client";

import NotificationIcon from "@/components/NotificationIcon";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DoctorProfile {
  id: number;
  ayursutraId: string;
  name: string;
  specialization: string;
  experience: string;
  patientsChecked: number;
  rating: string;
  biography?: string;
  location: string;
  hprId?: string;
  abhaId?: string;
  isVerified: boolean;
}

interface UserProfile {
  ayursutraId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch doctor profile data
  const fetchDoctorData = async () => {
    try {
      const response = await fetch("/api/doctor/profile");
      const data = await response.json();

      if (data.success) {
        setUserProfile(data.user);
        setDoctorProfile(data.doctor);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDoctorData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#109783]"></div>
      </div>
    );
  }
  return (
    <>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Welcome back,{" "}
                {doctorProfile?.name || userProfile?.name || "Doctor"}
              </p>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <NotificationIcon />

              <Link
                href="/dashboard/doctor/appointments/new"
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1 sm:mr-2"
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
                <span className="hidden sm:inline">New Appointment</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Good{" "}
                {new Date().getHours() < 12
                  ? "Morning"
                  : new Date().getHours() < 17
                    ? "Afternoon"
                    : "Evening"}
                !
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Here's what's happening with your practice today
              </p>
              {userProfile?.ayursutraId && (
                <p className="text-xs text-gray-500 mt-1">
                  ID: {userProfile.ayursutraId}
                </p>
              )}
            </div>

            {doctorProfile?.isVerified && (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {doctorProfile?.patientsChecked || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-lg">
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
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                <p className="text-xs text-blue-600 mt-1">3 pending</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
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
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Treatments
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
                <p className="text-xs text-green-600 mt-1">+5 this week</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
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
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹2.45L</p>
                <p className="text-xs text-orange-600 mt-1">
                  +18% vs last month
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
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
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Schedule
                </h3>
                <Link
                  href="/dashboard/doctor/appointments"
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        RK
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Ravi Kumar
                        </p>
                        <p className="text-xs text-gray-600">
                          Abhyanga + Swedana
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-teal-600">
                          9:00 AM
                        </p>
                        <p className="text-xs text-teal-500">60 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        PS
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Priya Sharma
                        </p>
                        <p className="text-xs text-gray-600">
                          Shirodhara Therapy
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">
                          11:30 AM
                        </p>
                        <p className="text-xs text-blue-500">45 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        AJ
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Anjali Jain
                        </p>
                        <p className="text-xs text-gray-600">Consultation</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-600">
                          2:00 PM
                        </p>
                        <p className="text-xs text-purple-500">30 min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/dashboard/doctor/appointments/new"
                  className="flex items-center p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-teal-100 group-hover:bg-teal-200 rounded-lg">
                    <svg
                      className="w-4 h-4 text-teal-600"
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
                  </div>
                  <span className="ml-3 text-sm font-medium">
                    New Appointment
                  </span>
                </Link>

                <Link
                  href="/dashboard/doctor/patients/new"
                  className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg">
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                  </div>
                  <span className="ml-3 text-sm font-medium">Add Patient</span>
                </Link>

                <Link
                  href="/dashboard/doctor/reports/new"
                  className="flex items-center p-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  <span className="ml-3 text-sm font-medium">
                    Generate Report
                  </span>
                </Link>
              </div>
            </div>

            {/* Practice Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Practice Insights
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Patient Satisfaction
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      94%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">
                      Average Rating
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-yellow-600 mr-1">
                        {doctorProfile?.rating || "4.8"}
                      </span>
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Notification Buttons */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Send Notifications
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={async () => {
                  try {
                    // Hardcoded doctor and patient IDs for testing
                    const doctorId = userProfile?.ayursutraId || "doctor-123";
                    const patientId = "AS-P-00066"; // Target patient ID

                    const response = await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        senderAyursutraId: doctorId,
                        receiverAyursutraId: patientId,
                        type: "prescription_ready",
                        title: "Prescription Ready",
                        message: "Your prescription is ready to view.",
                        data: {
                          prescriptionId: "test-123",
                          requiresAction: true,
                          date: new Date().toISOString(),
                        },
                        priority: "high",
                      }),
                    });

                    const result = await response.json();
                    if (result.success) {
                      alert("Prescription notification sent successfully!");
                    } else {
                      alert("Failed to send notification: " + result.error);
                    }
                  } catch (error) {
                    console.error("Error sending notification:", error);
                    alert("Error sending notification");
                  }
                }}
                className="flex items-center p-4 bg-gradient-to-br from-green-50 via-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Prescription Ready
                  </h4>
                  <p className="text-sm text-gray-600">
                    Notify patient that their prescription is ready to view
                  </p>
                </div>
              </button>

              <button
                onClick={async () => {
                  try {
                    // Hardcoded doctor and patient IDs for testing
                    const doctorId = userProfile?.ayursutraId || "doctor-123";
                    const patientId = "AS-P-00066"; // Target patient ID

                    const response = await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        senderAyursutraId: doctorId,
                        receiverAyursutraId: patientId,
                        type: "treatment_update",
                        title: "Treatment Progress Update",
                        message:
                          "Your treatment plan has been updated. Please review the latest changes.",
                        data: {
                          treatmentId: "therapy-789",
                          progress: 65,
                          requiresAction: false,
                          date: new Date().toISOString(),
                        },
                        priority: "medium",
                      }),
                    });

                    const result = await response.json();
                    if (result.success) {
                      alert("Treatment update notification sent successfully!");
                    } else {
                      alert("Failed to send notification: " + result.error);
                    }
                  } catch (error) {
                    console.error("Error sending notification:", error);
                    alert("Error sending notification");
                  }
                }}
                className="flex items-center p-4 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Treatment Update
                  </h4>
                  <p className="text-sm text-gray-600">
                    Send treatment progress update to patient
                  </p>
                </div>
              </button>

              <button
                onClick={async () => {
                  try {
                    // Hardcoded doctor and patient IDs for testing
                    const doctorId = userProfile?.ayursutraId || "doctor-123";
                    const patientId = "AS-P-00066"; // Target patient ID

                    const response = await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        senderAyursutraId: doctorId,
                        receiverAyursutraId: patientId,
                        type: "appointment_reminder",
                        title: "Appointment Reminder",
                        message:
                          "You have an upcoming appointment tomorrow at 10:00 AM.",
                        data: {
                          appointmentId: "appt-xyz",
                          appointmentTime: "2023-09-30T10:00:00Z",
                          requiresAction: true,
                          date: new Date().toISOString(),
                        },
                        priority: "high",
                      }),
                    });

                    const result = await response.json();
                    if (result.success) {
                      alert(
                        "Appointment reminder notification sent successfully!"
                      );
                    } else {
                      alert("Failed to send notification: " + result.error);
                    }
                  } catch (error) {
                    console.error("Error sending notification:", error);
                    alert("Error sending notification");
                  }
                }}
                className="flex items-center p-4 bg-gradient-to-br from-yellow-50 via-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Appointment Reminder
                  </h4>
                  <p className="text-sm text-gray-600">
                    Send upcoming appointment reminder to patient
                  </p>
                </div>
              </button>

              <button
                onClick={async () => {
                  try {
                    // Hardcoded doctor and patient IDs for testing
                    const doctorId = userProfile?.ayursutraId || "doctor-123";
                    const patientId = "AS-P-00066"; // Target patient ID

                    const response = await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        senderAyursutraId: doctorId,
                        receiverAyursutraId: patientId,
                        type: "general",
                        title: "Follow-up Required",
                        message:
                          "Please schedule a follow-up appointment to discuss your treatment progress.",
                        data: {
                          treatmentId: "therapy-789",
                          requiresAction: true,
                          urgency: "medium",
                          date: new Date().toISOString(),
                        },
                        priority: "medium",
                      }),
                    });

                    const result = await response.json();
                    if (result.success) {
                      alert("Follow-up notification sent successfully!");
                    } else {
                      alert("Failed to send notification: " + result.error);
                    }
                  } catch (error) {
                    console.error("Error sending notification:", error);
                    alert("Error sending notification");
                  }
                }}
                className="flex items-center p-4 bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Follow-up Required
                  </h4>
                  <p className="text-sm text-gray-600">
                    Notify patient that a follow-up visit is needed
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Treatments */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Popular Treatments
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 via-teal-50 to-teal-100 rounded-xl border border-teal-200">
                <div className="w-12 h-12 bg-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl">🌿</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Abhyanga</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Full body Ayurvedic oil massage
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-teal-600">
                    ₹2,500
                  </span>
                  <span className="text-xs text-gray-500">60 min</span>
                </div>
              </div>{" "}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl">💧</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Shirodhara</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Continuous oil pouring therapy
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ₹3,000
                  </span>
                  <span className="text-xs text-gray-500">45 min</span>
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 via-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl">🌱</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Swedana</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Medicated herbal steam therapy
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    ₹1,800
                  </span>
                  <span className="text-xs text-gray-500">30 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
