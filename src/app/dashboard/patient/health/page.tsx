"use client";

import NotificationIcon from "@/components/NotificationIcon";

export default function HealthInsightsPage() {
  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Health Insights
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track your wellness journey and health analytics
              </p>
            </div>
            <NotificationIcon />
          </div>
        </div>
      </header>
      <main className="p-6">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Health Insights Coming Soon
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            This feature is under development. You'll be able to track your
            health analytics and wellness insights here.
          </p>
        </div>
      </main>
    </>
  );
}
