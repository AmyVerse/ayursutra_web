"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication and role
  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/");
      return;
    }

    if (session.user.role !== "patient") {
      // Redirect to appropriate dashboard based on role
      if (session.user.role === "doctor") {
        router.push("/dashboard/doctor");
      } else {
        router.push("/");
      }
      return;
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Show loading state
  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#109783] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or wrong role
  if (!session || session.user.role !== "patient") return null;

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
              <span className="text-sm text-gray-600">
                {session.user.email || session.user.phone}
              </span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🤒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Patient Dashboard
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to your patient portal. This is a placeholder page. The full
            patient dashboard functionality will be implemented here.
          </p>

          {/* Placeholder Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-4xl mb-4">👩‍⚕️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Find Doctors
              </h3>
              <p className="text-gray-600 text-sm">
                Browse and book appointments with qualified Ayurvedic
                practitioners
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Appointments
              </h3>
              <p className="text-gray-600 text-sm">
                View and manage your upcoming and past appointments
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Health Reports
              </h3>
              <p className="text-gray-600 text-sm">
                Access your health assessments and treatment progress
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Messages
              </h3>
              <p className="text-gray-600 text-sm">
                Communicate with your healthcare providers
              </p>
            </div>
          </div>

          {/* IVR Link */}
          <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mt-8 rounded-r-lg max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-teal-400 text-2xl">📋</span>
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm text-teal-700">
                  Complete your initial health assessment before booking
                  appointments
                </p>
                <a
                  href="https://ayurvedic-dosha-diagnosis1.onrender.com"
                  className="text-teal-600 hover:text-teal-500 font-medium text-sm underline mt-1 inline-block"
                >
                  Fill the IVR Initial Vital Report →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
