"use client";

import PatientSidebar from "@/components/PatientSidebar";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Lazy load AyursutraAIFloat to avoid SSR issues
const AyursutraAIFloat = dynamic(
  () => import("@/components/AyursutraAIFloat"),
  { ssr: false }
);

interface PatientProfile {
  id: number;
  ayursutraId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
}

interface UserProfile {
  ayursutraId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch patient profile data
  const fetchPatientData = async () => {
    try {
      const response = await fetch("/api/patient/profile");
      const data = await response.json();

      if (data.success) {
        setUserProfile(data.user);
        setPatientProfile(data.patient);
      } else {
        console.error("Error fetching patient profile:", data.error);
      }
    } catch (error) {
      console.error("Error fetching patient profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

    // Fetch patient data if authenticated
    fetchPatientData();
  }, [session, status, router]);

  // Show loading state
  if (status === "loading" || !session || isLoading) {
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
  if (session.user.role !== "patient") return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Persistent Sidebar */}
      <PatientSidebar
        patientProfile={patientProfile || undefined}
        userProfile={userProfile || undefined}
      />

      {/* Main Content Area */}
      <div className="ml-16 sm:ml-20 lg:ml-64 transition-all duration-300">
        {children}
      </div>
      {/* Floating Ayursutra AI Button (Chatbot) */}
      <AyursutraAIFloat />
    </div>
  );
}
