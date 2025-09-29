"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // No session, redirect to home
      router.push("/");
      return;
    }

    // Redirect based on user role
    if (session.user.role === "doctor") {
      router.push("/dashboard/doctor");
    } else if (session.user.role === "patient") {
      router.push("/dashboard/patient");
    } else {
      // Fallback: redirect to home if role is undefined
      router.push("/");
    }
  }, [session, status, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#109783] mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
