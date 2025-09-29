"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface PatientSidebarProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  patientProfile?: {
    name: string;
    ayursutraId?: string;
  };
  userProfile?: {
    name: string;
    ayursutraId?: string;
  };
}

export default function PatientSidebar({
  onTabChange,
  activeTab,
  patientProfile,
  userProfile,
}: PatientSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard/patient",
      key: "overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
        </svg>
      ),
    },
    {
      name: "Find Doctors",
      href: "/dashboard/patient/find-doctors",
      key: "find-doctors",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      name: "My Appointments",
      href: "/dashboard/patient/appointments",
      key: "appointments",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      disabled: true,
    },
    {
      name: "Medical Records",
      href: "/dashboard/patient/records",
      key: "records",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      disabled: true,
    },
    {
      name: "Health Insights",
      href: "/dashboard/patient/health",
      key: "health",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      disabled: true,
    },
  ];

  const handleNavClick = (item: any) => {
    if (item.disabled) return;

    if (onTabChange && activeTab !== undefined) {
      // Using tab-based navigation (for main dashboard)
      onTabChange(item.key);
    } else {
      // Using router navigation (for separate pages)
      window.location.href = item.href;
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-16 sm:w-20 lg:w-64 bg-white shadow-lg transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center px-2 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 border-b border-gray-200">
          <Image
            src="/icon.png"
            alt="AyurSutra"
            width={32}
            height={32}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 sm:px-2 lg:px-4 py-3 sm:py-4 lg:py-6 space-y-1 sm:space-y-2">
          {navigation.map((item) => {
            const isActive = activeTab
              ? activeTab === item.key
              : pathname === item.href;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                disabled={isDisabled}
                title={item.name}
                className={`flex items-center justify-center lg:justify-start w-full px-2 sm:px-3 py-2 sm:py-2.5 lg:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-teal-600 bg-teal-50"
                    : isDisabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="flex-shrink-0 lg:mr-3">{item.icon}</span>
                <span className="hidden lg:block truncate">{item.name}</span>
                {isDisabled && (
                  <span className="hidden lg:block ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account Section */}
        <div className="px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 border-t border-gray-200">
          <div className="flex items-center justify-between lg:justify-between">
            <div className="flex items-center justify-center lg:justify-start flex-1 lg:flex-initial">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm lg:text-sm font-semibold">
                  {(
                    patientProfile?.name ||
                    userProfile?.name ||
                    session?.user?.name
                  )?.charAt(0) ||
                    session?.user?.email?.charAt(0) ||
                    "P"}
                </span>
              </div>
              <div className="hidden lg:block ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {patientProfile?.name ||
                    userProfile?.name ||
                    session?.user?.name ||
                    "Patient"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userProfile?.ayursutraId ||
                    patientProfile?.ayursutraId ||
                    session?.user?.email ||
                    session?.user?.phone}
                </p>
              </div>
            </div>

            {/* Account Menu */}
            <div className="relative lg:relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="p-1 lg:p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Account Menu"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              {showAccountMenu && (
                <div className="absolute bottom-full right-0 lg:right-0 mb-2 w-48 sm:w-52 lg:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Account Settings
                  </button>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
