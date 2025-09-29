"use client";

import NotificationIcon from "@/components/NotificationIcon";

export default function AppointmentsPage() {
  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Appointments
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage your appointments
              </p>
            </div>
            <NotificationIcon />
          </div>
        </div>
      </header>
      <main className="p-6">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Appointments Coming Soon
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            This feature is under development. You'll be able to view and manage
            all your appointments here.
          </p>
        </div>
      </main>
    </>
  );
}
