"use client";

import DoctorSidebar from "@/components/DoctorSidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
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
      } else {
        console.error("Error fetching doctor profile:", data.error);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
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

    if (session.user.role !== "doctor") {
      // Redirect to appropriate dashboard based on role
      if (session.user.role === "patient") {
        router.push("/dashboard/patient");
      } else {
        router.push("/");
      }
      return;
    }

    // Fetch doctor data if authenticated
    fetchDoctorData();
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
  if (session.user.role !== "doctor") return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Persistent Sidebar */}
      <DoctorSidebar
        doctorProfile={doctorProfile || undefined}
        userProfile={userProfile || undefined}
      />

      {/* Main Content Area */}
      <div className="ml-16 sm:ml-20 lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
