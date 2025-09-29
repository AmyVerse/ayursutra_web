"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TherapyData {
  therapy: string;
  purvakarma: string[];
  pradhanakarma: string[];
  paschatkarma: string[];
  totalDays?: number;
  completedDays?: number;
  currentDay?: number;
  purvakarmaProgress?: number;
  pradhanakarmaProgress?: number;
  paschatkarmaProgress?: number;
  purvakarmaDays?: number;
  pradhanakarmaaDays?: number;
  paschatkarmaaDays?: number;
  startDate?: string;
  isEditingDate?: boolean;
}

interface PrescriptionData {
  patientName: string;
  patientId: string;
  therapies: TherapyData[];
  medications: string[];
  preRequirements: string;
  postRequirements: string;
  date: string;
}

export default function PrescriptionView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const searchParams = useSearchParams();
  const unwrappedParams = React.use(params);
  const appointmentId = unwrappedParams.id;
  const [prescriptionData, setPrescriptionData] =
    useState<PrescriptionData | null>(null);
  const [therapyProgress, setTherapyProgress] = useState<TherapyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageAvailable, setStorageAvailable] = useState(false);

  // Check if localStorage is available
  useEffect(() => {
    try {
      const x = "__storage_test__";
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      setStorageAvailable(true);
    } catch (e) {
      console.warn("localStorage is not available in this browser or context");
      setStorageAvailable(false);
    }
  }, []);

  useEffect(() => {
    // First try to get data from local storage
    const localStorageKey = `prescription_${appointmentId}`;
    const storedData =
      typeof window !== "undefined"
        ? localStorage.getItem(localStorageKey)
        : null;

    // If data exists in local storage, use it
    if (storedData) {
      try {
        const {
          prescriptionData: storedPrescription,
          therapyProgress: storedProgress,
        } = JSON.parse(storedData);
        setPrescriptionData(storedPrescription);
        setTherapyProgress(storedProgress);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing stored prescription data:", error);
        // Continue with URL param approach if local storage fails
      }
    }

    // If not in local storage, try to get from URL parameters
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setPrescriptionData(parsed);

        // Initialize therapy progress with default values
        const initialProgress = parsed.therapies.map((therapy: TherapyData) => {
          const totalDays = therapy.totalDays || 7;
          // Ensure days sum up to total exactly - better distribution
          let purvakarmaDays = Math.floor(totalDays * 0.3); // 30%
          let pradhanakarmaaDays = Math.floor(totalDays * 0.5); // 50%
          let paschatkarmaaDays =
            totalDays - purvakarmaDays - pradhanakarmaaDays; // Exact remainder

          // Ensure minimum 1 day for each phase
          if (purvakarmaDays === 0) purvakarmaDays = 1;
          if (paschatkarmaaDays === 0) paschatkarmaaDays = 1;

          // Recalculate pradhana to fit exactly
          pradhanakarmaaDays = totalDays - purvakarmaDays - paschatkarmaaDays;

          return {
            ...therapy,
            totalDays,
            completedDays: therapy.completedDays || 0,
            currentDay: therapy.currentDay || 0, // Start from 0
            purvakarmaProgress: therapy.purvakarmaProgress || 0,
            pradhanakarmaProgress: therapy.pradhanakarmaProgress || 0,
            paschatkarmaProgress: therapy.paschatkarmaProgress || 0,
            // Use calculated days that sum up exactly
            purvakarmaDays,
            pradhanakarmaaDays,
            paschatkarmaaDays,
            startDate: therapy.startDate || new Date().toISOString(),
            isEditingDate: false,
          };
        });
        setTherapyProgress(initialProgress);

        // Save to local storage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            localStorageKey,
            JSON.stringify({
              prescriptionData: parsed,
              therapyProgress: initialProgress,
            })
          );
        }
      } catch (error) {
        console.error("Error parsing prescription data from URL:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [searchParams, appointmentId]);

  // Helper function to save current state to localStorage
  const saveToLocalStorage = (updatedProgress: TherapyData[]) => {
    if (typeof window !== "undefined" && prescriptionData && storageAvailable) {
      try {
        const localStorageKey = `prescription_${appointmentId}`;
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            prescriptionData,
            therapyProgress: updatedProgress,
          })
        );
        console.log("Saved prescription data to localStorage");
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  // Add a clear localStorage feature
  const clearPrescriptionData = () => {
    if (typeof window !== "undefined" && storageAvailable) {
      try {
        const localStorageKey = `prescription_${appointmentId}`;
        localStorage.removeItem(localStorageKey);
        window.location.reload();
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  };

  const updateKarmaProgress = (
    therapyIndex: number,
    karmaType: "purvakarma" | "pradhanakarma" | "paschatkarma",
    action: "complete" | "extend"
  ) => {
    setTherapyProgress((prev) => {
      const updated = [...prev];
      const therapy = updated[therapyIndex];

      if (action === "complete") {
        // Advance the current day by 1
        const newCurrentDay = (therapy.currentDay || 0) + 1;
        const maxDay = therapy.totalDays || 7;

        updated[therapyIndex] = {
          ...therapy,
          currentDay: Math.min(newCurrentDay, maxDay),
          completedDays: Math.min(newCurrentDay, maxDay),
        };
      } else if (action === "extend") {
        // Increase total therapy duration by 1 day and add it to the clicked karma phase
        const newTotalDays = (therapy.totalDays || 7) + 1;

        let newPurvakarmaDays = therapy.purvakarmaDays || 2;
        let newPradhanakarmaaDays = therapy.pradhanakarmaaDays || 4;
        let newPaschatkarmaaDays = therapy.paschatkarmaaDays || 1;

        // Add the extra day to the specific karma phase that was clicked
        if (karmaType === "purvakarma") {
          newPurvakarmaDays += 1;
        } else if (karmaType === "pradhanakarma") {
          newPradhanakarmaaDays += 1;
        } else if (karmaType === "paschatkarma") {
          newPaschatkarmaaDays += 1;
        }

        updated[therapyIndex] = {
          ...therapy,
          totalDays: newTotalDays,
          purvakarmaDays: newPurvakarmaDays,
          pradhanakarmaaDays: newPradhanakarmaaDays,
          paschatkarmaaDays: newPaschatkarmaaDays,
        };
      }

      // Save updated state to localStorage
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const getKarmaProgressPercentage = (
    therapy: TherapyData,
    karmaType: "purvakarma" | "pradhanakarma" | "paschatkarma"
  ) => {
    const { completedDays, assignedDays } = getKarmaDaysProgress(
      therapy,
      karmaType
    );
    return assignedDays > 0
      ? Math.round((completedDays / assignedDays) * 100)
      : 0;
  };

  const isKarmaComplete = (
    therapy: TherapyData,
    karmaType: "purvakarma" | "pradhanakarma" | "paschatkarma"
  ) => {
    const { completedDays, assignedDays } = getKarmaDaysProgress(
      therapy,
      karmaType
    );
    return completedDays >= assignedDays;
  };

  const generateStartDate = (therapyIndex: number) => {
    setTherapyProgress((prev) => {
      const updated = [...prev];
      const today = new Date();
      updated[therapyIndex] = {
        ...updated[therapyIndex],
        startDate: today.toISOString(),
      };
      // Save to localStorage
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const formatStartDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateEndDate = (startDate: string, totalDays: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + totalDays - 1);
    return end.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleEditDate = (therapyIndex: number) => {
    setTherapyProgress((prev) => {
      const updated = [...prev];
      updated[therapyIndex] = {
        ...updated[therapyIndex],
        isEditingDate: !updated[therapyIndex].isEditingDate,
      };
      // Save to localStorage
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateStartDate = (therapyIndex: number, newDate: string) => {
    setTherapyProgress((prev) => {
      const updated = [...prev];
      updated[therapyIndex] = {
        ...updated[therapyIndex],
        startDate: newDate,
        isEditingDate: false,
      };
      // Save to localStorage
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getKarmaDaysProgress = (
    therapy: TherapyData,
    karmaType: "purvakarma" | "pradhanakarma" | "paschatkarma"
  ) => {
    const currentDay = therapy.currentDay || 0; // Start from 0
    let assignedDays = 0;
    let completedDays = 0;

    if (karmaType === "purvakarma") {
      assignedDays = therapy.purvakarmaDays || 2;
      // Days 0 to (purvakarmaDays-1) are purvakarma days
      completedDays = Math.min(currentDay, assignedDays);
    } else if (karmaType === "pradhanakarma") {
      assignedDays = therapy.pradhanakarmaaDays || 4;
      const purvakarmaaDays = therapy.purvakarmaDays || 2;
      const startDay = purvakarmaaDays; // Starts after purvakarma
      // Pradhana karma runs from startDay to startDay + assignedDays - 1
      completedDays = Math.max(
        0,
        Math.min(currentDay - startDay, assignedDays)
      );
    } else if (karmaType === "paschatkarma") {
      assignedDays = therapy.paschatkarmaaDays || 1;
      const purvakarmaaDays = therapy.purvakarmaDays || 2;
      const pradhanakarmaaDays = therapy.pradhanakarmaaDays || 4;
      const startDay = purvakarmaaDays + pradhanakarmaaDays; // Starts after both previous phases
      completedDays = Math.max(
        0,
        Math.min(currentDay - startDay, assignedDays)
      );
    }

    return { completedDays: Math.max(0, completedDays), assignedDays };
  };

  const getTotalKarmaDays = (therapy: TherapyData) => {
    const purva = therapy.purvakarmaDays || 0;
    const pradhana = therapy.pradhanakarmaaDays || 0;
    const paschat = therapy.paschatkarmaaDays || 0;
    return purva + pradhana + paschat;
  };

  const getRemainingDays = (therapy: TherapyData) => {
    const totalDays = therapy.totalDays || 7;
    const currentDay = therapy.currentDay || 0;
    // Current day 0 means 0 completed, current day 7 means 7 completed
    const completedDays = Math.min(currentDay, totalDays);
    return Math.max(0, totalDays - completedDays);
  };

  const getCompletedDays = (therapy: TherapyData) => {
    const totalDays = therapy.totalDays || 7;
    const currentDay = therapy.currentDay || 0;
    // Completed days should never exceed total days
    return Math.min(currentDay, totalDays);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-128px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!prescriptionData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-700">
              No prescription found
            </h2>
            <p className="mt-2 text-gray-500">
              This appointment doesn't have a prescription yet.
            </p>
            <div className="mt-6">
              <Link
                href={`/dashboard/doctor/appointments/attend/${appointmentId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Create Prescription
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Prescription View
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View and track treatment progress
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/doctor/appointments"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </Link>
              <div className="flex items-center space-x-2">
                {storageAvailable && (
                  <button
                    onClick={clearPrescriptionData}
                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Reset
                  </button>
                )}
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 print:p-0">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm print:shadow-none">
            {/* Prescription Header */}
            <div className="bg-teal-600 text-white p-6 rounded-t-lg print:bg-teal-600">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Ayurvedic Prescription</h2>
                <p className="text-teal-100 mt-1">Panchakarma Treatment Plan</p>
                <div className="mt-3 text-sm">
                  <p>Date: {formatDate(prescriptionData.date)}</p>
                </div>
              </div>
            </div>

            {/* Prescription Content */}
            <div className="p-6">
              {/* Patient Information */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <label className="block text-sm font-medium text-gray-500">
                      Patient Name
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {prescriptionData.patientName}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <label className="block text-sm font-medium text-gray-500">
                      Patient ID
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {prescriptionData.patientId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescribed Therapies */}
              {therapyProgress.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Prescribed Therapies & Progress
                  </h3>

                  <div className="space-y-6">
                    {therapyProgress.map((therapy, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      >
                        {/* Therapy Header */}
                        <div className="bg-teal-600 text-white p-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">
                              {index + 1}. {therapy.therapy}
                            </h4>
                            <div className="flex items-center">
                              {!therapy.startDate && (
                                <button
                                  onClick={() => generateStartDate(index)}
                                  className="bg-green-500 hover:bg-green-600 text-xs text-white px-2 py-1 rounded transition-colors duration-200 print:hidden"
                                >
                                  Generate Start Date
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Therapy Content */}
                        <div className="p-4">
                          <div className="space-y-4">
                            {/* Purvakarma */}
                            {therapy.purvakarma.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-gray-700">
                                    Purvakarma (Preparation)
                                  </h5>
                                  <div className="flex items-center space-x-2 print:hidden">
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                      {
                                        getKarmaDaysProgress(
                                          therapy,
                                          "purvakarma"
                                        ).completedDays
                                      }
                                      /
                                      {
                                        getKarmaDaysProgress(
                                          therapy,
                                          "purvakarma"
                                        ).assignedDays
                                      }{" "}
                                      days
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateKarmaProgress(
                                          index,
                                          "purvakarma",
                                          "complete"
                                        )
                                      }
                                      className="bg-teal-500 hover:bg-teal-600 text-white p-1 rounded text-xs"
                                      disabled={isKarmaComplete(
                                        therapy,
                                        "purvakarma"
                                      )}
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateKarmaProgress(
                                          index,
                                          "purvakarma",
                                          "extend"
                                        )
                                      }
                                      className="bg-teal-500 hover:bg-teal-600 text-white p-1 rounded text-xs"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4v16m8-8H4"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full transition-all duration-500 ${
                                        isKarmaComplete(therapy, "purvakarma")
                                          ? "bg-green-500"
                                          : "bg-teal-500"
                                      }`}
                                      style={{
                                        width: `${getKarmaProgressPercentage(therapy, "purvakarma")}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Items */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {therapy.purvakarma.map((item, i) => {
                                    const { completedDays, assignedDays } =
                                      getKarmaDaysProgress(
                                        therapy,
                                        "purvakarma"
                                      );
                                    const itemsPerDay = Math.ceil(
                                      therapy.purvakarma.length / assignedDays
                                    );
                                    const completedItems = Math.min(
                                      completedDays * itemsPerDay,
                                      therapy.purvakarma.length
                                    );

                                    return (
                                      <div
                                        key={i}
                                        className={`flex items-center p-2 rounded ${
                                          i < completedItems
                                            ? "bg-green-50 border border-green-100"
                                            : "bg-white border border-gray-100"
                                        }`}
                                      >
                                        <span
                                          className={`w-2 h-2 rounded-full mr-2 ${i < completedItems ? "bg-green-500" : "bg-gray-300"}`}
                                        ></span>
                                        <span className="text-sm text-gray-700">
                                          {item}
                                        </span>
                                        {i < completedItems && (
                                          <svg
                                            className="w-3 h-3 ml-auto text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Pradhana Karma */}
                            {therapy.pradhanakarma.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-gray-700">
                                    Pradhana Karma (Main)
                                  </h5>
                                  <div className="flex items-center space-x-2 print:hidden">
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                      {
                                        getKarmaDaysProgress(
                                          therapy,
                                          "pradhanakarma"
                                        ).completedDays
                                      }
                                      /
                                      {
                                        getKarmaDaysProgress(
                                          therapy,
                                          "pradhanakarma"
                                        ).assignedDays
                                      }{" "}
                                      days
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateKarmaProgress(
                                          index,
                                          "pradhanakarma",
                                          "complete"
                                        )
                                      }
                                      className="bg-teal-500 hover:bg-teal-600 text-white p-1 rounded text-xs"
                                      disabled={isKarmaComplete(
                                        therapy,
                                        "pradhanakarma"
                                      )}
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateKarmaProgress(
                                          index,
                                          "pradhanakarma",
                                          "extend"
                                        )
                                      }
                                      className="bg-teal-500 hover:bg-teal-600 text-white p-1 rounded text-xs"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4v16m8-8H4"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full transition-all duration-500 ${
                                        isKarmaComplete(
                                          therapy,
                                          "pradhanakarma"
                                        )
                                          ? "bg-green-500"
                                          : "bg-teal-500"
                                      }`}
                                      style={{
                                        width: `${getKarmaProgressPercentage(therapy, "pradhanakarma")}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Items */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {therapy.pradhanakarma.map((item, i) => {
                                    const { completedDays, assignedDays } =
                                      getKarmaDaysProgress(
                                        therapy,
                                        "pradhanakarma"
                                      );
                                    const itemsPerDay = Math.ceil(
                                      therapy.pradhanakarma.length /
                                        assignedDays
                                    );
                                    const completedItems = Math.min(
                                      completedDays * itemsPerDay,
                                      therapy.pradhanakarma.length
                                    );

                                    return (
                                      <div
                                        key={i}
                                        className={`flex items-center p-2 rounded ${
                                          i < completedItems
                                            ? "bg-green-50 border border-green-100"
                                            : "bg-white border border-gray-100"
                                        }`}
                                      >
                                        <span
                                          className={`w-2 h-2 rounded-full mr-2 ${i < completedItems ? "bg-green-500" : "bg-gray-300"}`}
                                        ></span>
                                        <span className="text-sm text-gray-700">
                                          {item}
                                        </span>
                                        {i < completedItems && (
                                          <svg
                                            className="w-3 h-3 ml-auto text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Paschat Karma */}
                            {therapy.paschatkarma.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-gray-700">
                                    Paschat Karma (Post-care)
                                  </h5>
                                  <div className="flex items-center space-x-2 print:hidden">
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                      {
                                        getKarmaDaysProgress(
                                          therapy,
                                          "paschatkarma"
                                        ).completedDays
                                      }
                                      /
                                      {
                                        getKarmaDaysProgress(
                                          therapy,
                                          "paschatkarma"
                                        ).assignedDays
                                      }{" "}
                                      days
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateKarmaProgress(
                                          index,
                                          "paschatkarma",
                                          "complete"
                                        )
                                      }
                                      className="bg-teal-500 hover:bg-teal-600 text-white p-1 rounded text-xs"
                                      disabled={isKarmaComplete(
                                        therapy,
                                        "paschatkarma"
                                      )}
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateKarmaProgress(
                                          index,
                                          "paschatkarma",
                                          "extend"
                                        )
                                      }
                                      className="bg-teal-500 hover:bg-teal-600 text-white p-1 rounded text-xs"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4v16m8-8H4"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full transition-all duration-500 ${
                                        isKarmaComplete(therapy, "paschatkarma")
                                          ? "bg-green-500"
                                          : "bg-teal-500"
                                      }`}
                                      style={{
                                        width: `${getKarmaProgressPercentage(therapy, "paschatkarma")}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Items */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {therapy.paschatkarma.map((item, i) => {
                                    const { completedDays, assignedDays } =
                                      getKarmaDaysProgress(
                                        therapy,
                                        "paschatkarma"
                                      );
                                    const itemsPerDay = Math.ceil(
                                      therapy.paschatkarma.length / assignedDays
                                    );
                                    const completedItems = Math.min(
                                      completedDays * itemsPerDay,
                                      therapy.paschatkarma.length
                                    );

                                    return (
                                      <div
                                        key={i}
                                        className={`flex items-center p-2 rounded ${
                                          i < completedItems
                                            ? "bg-green-50 border border-green-100"
                                            : "bg-white border border-gray-100"
                                        }`}
                                      >
                                        <span
                                          className={`w-2 h-2 rounded-full mr-2 ${i < completedItems ? "bg-green-500" : "bg-gray-300"}`}
                                        ></span>
                                        <span className="text-sm text-gray-700">
                                          {item}
                                        </span>
                                        {i < completedItems && (
                                          <svg
                                            className="w-3 h-3 ml-auto text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Schedule */}
                            {therapy.startDate && (
                              <div className="bg-gray-50 p-3 rounded border border-gray-200 relative">
                                {/* Edit Button */}
                                <button
                                  onClick={() => toggleEditDate(index)}
                                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors print:hidden"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>

                                <h5 className="font-medium text-gray-700 mb-3">
                                  Therapy Schedule
                                </h5>

                                {/* Date Editor */}
                                {therapy.isEditingDate && (
                                  <div className="mb-3 p-2 bg-white rounded border border-gray-200 print:hidden">
                                    <div className="flex items-center space-x-2">
                                      <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                          New Start Date
                                        </label>
                                        <input
                                          type="date"
                                          defaultValue={formatDateForInput(
                                            therapy.startDate
                                          )}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          onChange={(e) => {
                                            if (e.target.value) {
                                              const newDate = new Date(
                                                e.target.value
                                              ).toISOString();
                                              updateStartDate(index, newDate);
                                            }
                                          }}
                                        />
                                      </div>
                                      <button
                                        onClick={() => toggleEditDate(index)}
                                        className="mt-5 px-2 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="bg-white p-2 rounded border border-gray-200">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Start Date
                                    </label>
                                    <p className="text-sm text-gray-800">
                                      {formatStartDate(therapy.startDate)}
                                    </p>
                                  </div>
                                  <div className="bg-white p-2 rounded border border-gray-200">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      End Date
                                    </label>
                                    <p className="text-sm text-gray-800">
                                      {calculateEndDate(
                                        therapy.startDate,
                                        therapy.totalDays || 7
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 bg-white p-2 rounded border border-gray-200">
                                  <div className="flex justify-between">
                                    <label className="block text-xs font-medium text-gray-500">
                                      Duration & Progress
                                    </label>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-700">
                                        {getCompletedDays(therapy)} of{" "}
                                        {therapy.totalDays || 7} days completed
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {getRemainingDays(therapy)} days
                                        remaining
                                      </p>
                                    </div>
                                  </div>
                                  {/* Overall Progress Bar */}
                                  <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div
                                        className="bg-teal-500 h-1.5 rounded-full"
                                        style={{
                                          width: `${(getCompletedDays(therapy) / (therapy.totalDays || 7)) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {prescriptionData.medications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Prescribed Medications
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {prescriptionData.medications.map((medication, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <span className="w-5 h-5 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{medication}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Pre Requirements */}
                {prescriptionData.preRequirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Pre-Treatment Requirements
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {prescriptionData.preRequirements}
                      </p>
                    </div>
                  </div>
                )}

                {/* Post Requirements */}
                {prescriptionData.postRequirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Post-Treatment Care
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {prescriptionData.postRequirements}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Doctor's Signature */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Prescribed by:</p>
                    <div className="h-10 border-b border-gray-300 w-40">
                      <p className="text-xs text-gray-400">
                        Doctor's Signature
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Date:</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(prescriptionData.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>
                  This prescription is generated electronically and is valid for
                  the treatment period specified.
                </p>
                <p className="mt-1">
                  For any queries, please contact your Ayurvedic practitioner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
