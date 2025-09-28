'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function PrescriptionView() {
  const searchParams = useSearchParams();
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [therapyProgress, setTherapyProgress] = useState<TherapyData[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend using an ID
    // For now, we'll get it from localStorage or URL params
    const data = searchParams.get('data');
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
          let paschatkarmaaDays = totalDays - purvakarmaDays - pradhanakarmaaDays; // Exact remainder
          
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
            startDate: therapy.startDate || null,
            isEditingDate: false
          };
        });
        setTherapyProgress(initialProgress);
      } catch (error) {
        console.error('Error parsing prescription data:', error);
      }
    }
  }, [searchParams]);

  const updateKarmaProgress = (therapyIndex: number, karmaType: 'purvakarma' | 'pradhanakarma' | 'paschatkarma', action: 'complete' | 'extend') => {
    setTherapyProgress(prev => {
      const updated = [...prev];
      const therapy = updated[therapyIndex];
      
      if (action === 'complete') {
        // Advance the current day by 1
        const newCurrentDay = (therapy.currentDay || 0) + 1;
        const maxDay = therapy.totalDays || 7;
        
        updated[therapyIndex] = {
          ...therapy,
          currentDay: Math.min(newCurrentDay, maxDay),
          completedDays: Math.min(newCurrentDay, maxDay)
        };
      } else if (action === 'extend') {
        // Increase total therapy duration by 1 day and add it to the clicked karma phase
        const newTotalDays = (therapy.totalDays || 7) + 1;
        
        let newPurvakarmaDays = therapy.purvakarmaDays || 2;
        let newPradhanakarmaaDays = therapy.pradhanakarmaaDays || 4;
        let newPaschatkarmaaDays = therapy.paschatkarmaaDays || 1;
        
        // Add the extra day to the specific karma phase that was clicked
        if (karmaType === 'purvakarma') {
          newPurvakarmaDays += 1;
        } else if (karmaType === 'pradhanakarma') {
          newPradhanakarmaaDays += 1;
        } else if (karmaType === 'paschatkarma') {
          newPaschatkarmaaDays += 1;
        }
        
        updated[therapyIndex] = {
          ...therapy,
          totalDays: newTotalDays,
          purvakarmaDays: newPurvakarmaDays,
          pradhanakarmaaDays: newPradhanakarmaaDays,
          paschatkarmaaDays: newPaschatkarmaaDays
        };
      }
      
      return updated;
    });
  };

  const getKarmaProgressPercentage = (therapy: TherapyData, karmaType: 'purvakarma' | 'pradhanakarma' | 'paschatkarma') => {
    const { completedDays, assignedDays } = getKarmaDaysProgress(therapy, karmaType);
    return assignedDays > 0 ? Math.round((completedDays / assignedDays) * 100) : 0;
  };

  const isKarmaComplete = (therapy: TherapyData, karmaType: 'purvakarma' | 'pradhanakarma' | 'paschatkarma') => {
    const { completedDays, assignedDays } = getKarmaDaysProgress(therapy, karmaType);
    return completedDays >= assignedDays;
  };

  const generateStartDate = (therapyIndex: number) => {
    setTherapyProgress(prev => {
      const updated = [...prev];
      const today = new Date();
      updated[therapyIndex] = {
        ...updated[therapyIndex],
        startDate: today.toISOString()
      };
      return updated;
    });
  };

  const formatStartDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateEndDate = (startDate: string, totalDays: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + totalDays - 1);
    return end.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleEditDate = (therapyIndex: number) => {
    setTherapyProgress(prev => {
      const updated = [...prev];
      updated[therapyIndex] = {
        ...updated[therapyIndex],
        isEditingDate: !updated[therapyIndex].isEditingDate
      };
      return updated;
    });
  };

  const updateStartDate = (therapyIndex: number, newDate: string) => {
    setTherapyProgress(prev => {
      const updated = [...prev];
      updated[therapyIndex] = {
        ...updated[therapyIndex],
        startDate: newDate,
        isEditingDate: false
      };
      return updated;
    });
  };

  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  const getKarmaDaysProgress = (therapy: TherapyData, karmaType: 'purvakarma' | 'pradhanakarma' | 'paschatkarma') => {
    const currentDay = therapy.currentDay || 0; // Start from 0
    let assignedDays = 0;
    let completedDays = 0;

    if (karmaType === 'purvakarma') {
      assignedDays = therapy.purvakarmaDays || 2;
      // Days 0 to (purvakarmaDays-1) are purvakarma days
      completedDays = Math.min(currentDay, assignedDays);
    } else if (karmaType === 'pradhanakarma') {
      assignedDays = therapy.pradhanakarmaaDays || 4;
      const purvakarmaaDays = therapy.purvakarmaDays || 2;
      const startDay = purvakarmaaDays; // Starts after purvakarma
      // Pradhana karma runs from startDay to startDay + assignedDays - 1
      completedDays = Math.max(0, Math.min(currentDay - startDay, assignedDays));
    } else if (karmaType === 'paschatkarma') {
      assignedDays = therapy.paschatkarmaaDays || 1;
      const purvakarmaaDays = therapy.purvakarmaDays || 2;
      const pradhanakarmaaDays = therapy.pradhanakarmaaDays || 4;
      const startDay = purvakarmaaDays + pradhanakarmaaDays; // Starts after both previous phases
      completedDays = Math.max(0, Math.min(currentDay - startDay, assignedDays));
    }

    return { completedDays: Math.max(0, completedDays), assignedDays };
  };

  // Verification function to ensure days sum up correctly
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!prescriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prescription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header with Print Button */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Prescription
          </button>
        </div>

        {/* Prescription Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl print:bg-green-600 print:rounded-none">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Ayurvedic Prescription</h1>
              <p className="text-green-100 mt-2">Panchakarma Treatment Plan</p>
              <div className="mt-4 text-sm">
                <p>Date: {formatDate(prescriptionData.date)}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Patient Information */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 print:bg-gray-50">
              <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Patient Name</label>
                  <p className="text-lg font-medium text-gray-800">{prescriptionData.patientName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Patient ID</label>
                  <p className="text-lg font-medium text-gray-800">{prescriptionData.patientId}</p>
                </div>
              </div>
            </div>

            {/* Prescribed Therapies */}
            {therapyProgress.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 print:bg-gray-50">
                <h2 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Prescribed Therapies & Progress
                </h2>

                <div className="space-y-6">
                  {therapyProgress.map((therapy, index) => (
                    <div key={index} className="bg-white rounded-xl border border-blue-200 overflow-hidden print:break-inside-avoid">
                      {/* Therapy Header with Progress */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 print:bg-blue-600">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold">
                            {index + 1}. {therapy.therapy}
                          </h3>
                          <div className="flex items-center space-x-4">
                            {/* Generate Start Date Button - Hide on print */}
                            <div className="print:hidden">
                              {!therapy.startDate && (
                                <button
                                  onClick={() => generateStartDate(index)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center text-sm"
                                  title="Generate Start Date"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Generate Start Date
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Therapy Details */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {/* Purvakarma */}
                          {therapy.purvakarma.length > 0 && (
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 print:bg-gray-50">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-yellow-800 print:text-gray-800 flex items-center">
                                  <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 print:bg-gray-500">P</span>
                                  Purvakarma (Preparation)
                                </h4>
                                <div className="flex items-center space-x-2 print:hidden">
                                  <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                                    {getKarmaDaysProgress(therapy, 'purvakarma').completedDays}/{getKarmaDaysProgress(therapy, 'purvakarma').assignedDays} days
                                  </span>
                                  <button
                                    onClick={() => updateKarmaProgress(index, 'purvakarma', 'complete')}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded text-xs"
                                    disabled={isKarmaComplete(therapy, 'purvakarma')}
                                    title="Complete Next Item"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => updateKarmaProgress(index, 'purvakarma', 'extend')}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded text-xs"
                                    title="Add 1 Day to Purvakarma Phase"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Progress Bar for Purvakarma */}
                              <div className="mb-3">
                                <div className="w-full bg-yellow-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      isKarmaComplete(therapy, 'purvakarma') ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}
                                    style={{ width: `${getKarmaProgressPercentage(therapy, 'purvakarma')}%` }}
                                  ></div>
                                </div>
                                {isKarmaComplete(therapy, 'purvakarma') && (
                                  <div className="flex items-center mt-1 text-green-600">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs font-medium">Purvakarma Complete</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {therapy.purvakarma.map((item, i) => {
                                  const { completedDays, assignedDays } = getKarmaDaysProgress(therapy, 'purvakarma');
                                  const itemsPerDay = Math.ceil(therapy.purvakarma.length / assignedDays);
                                  const completedItems = Math.min(completedDays * itemsPerDay, therapy.purvakarma.length);
                                  const currentItem = Math.min(completedItems, therapy.purvakarma.length - 1);
                                  
                                  return (
                                    <div key={i} className={`flex items-center p-2 rounded border border-yellow-200 transition-all duration-300 ${
                                      i < completedItems
                                        ? 'bg-green-100 border-green-300' 
                                        : i === currentItem && completedDays < assignedDays
                                        ? 'bg-yellow-200 border-yellow-400 ring-2 ring-yellow-300'
                                        : 'bg-white'
                                    }`}>
                                      <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                                        i < completedItems
                                          ? 'bg-green-500'
                                          : i === currentItem && completedDays < assignedDays
                                          ? 'bg-yellow-500 animate-pulse'
                                          : 'bg-gray-300'
                                      } print:bg-gray-500`}></span>
                                      <span className="text-sm text-gray-700">{item}</span>
                                      {i < completedItems && (
                                        <svg className="w-3 h-3 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200 print:bg-gray-50">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-red-800 print:text-gray-800 flex items-center">
                                  <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 print:bg-gray-500">M</span>
                                  Pradhana Karma (Main Treatment)
                                </h4>
                                <div className="flex items-center space-x-2 print:hidden">
                                  <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                                    {getKarmaDaysProgress(therapy, 'pradhanakarma').completedDays}/{getKarmaDaysProgress(therapy, 'pradhanakarma').assignedDays} days
                                  </span>
                                  <button
                                    onClick={() => updateKarmaProgress(index, 'pradhanakarma', 'complete')}
                                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs"
                                    disabled={isKarmaComplete(therapy, 'pradhanakarma')}
                                    title="Complete Next Item"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => updateKarmaProgress(index, 'pradhanakarma', 'extend')}
                                    className="bg-red-400 hover:bg-red-500 text-white p-1 rounded text-xs"
                                    title="Add 1 Day to Main Treatment Phase"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Progress Bar for Pradhana Karma */}
                              <div className="mb-3">
                                <div className="w-full bg-red-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      isKarmaComplete(therapy, 'pradhanakarma') ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${getKarmaProgressPercentage(therapy, 'pradhanakarma')}%` }}
                                  ></div>
                                </div>
                                {isKarmaComplete(therapy, 'pradhanakarma') && (
                                  <div className="flex items-center mt-1 text-green-600">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs font-medium">Main Treatment Complete</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {therapy.pradhanakarma.map((item, i) => {
                                  const { completedDays, assignedDays } = getKarmaDaysProgress(therapy, 'pradhanakarma');
                                  const itemsPerDay = Math.ceil(therapy.pradhanakarma.length / assignedDays);
                                  const completedItems = Math.min(completedDays * itemsPerDay, therapy.pradhanakarma.length);
                                  const currentItem = Math.min(completedItems, therapy.pradhanakarma.length - 1);
                                  
                                  return (
                                    <div key={i} className={`flex items-center p-2 rounded border border-red-200 transition-all duration-300 ${
                                      i < completedItems
                                        ? 'bg-green-100 border-green-300' 
                                        : i === currentItem && completedDays < assignedDays
                                        ? 'bg-red-200 border-red-400 ring-2 ring-red-300'
                                        : 'bg-white'
                                    }`}>
                                      <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                                        i < completedItems
                                          ? 'bg-green-500'
                                          : i === currentItem && completedDays < assignedDays
                                          ? 'bg-red-500 animate-pulse'
                                          : 'bg-gray-300'
                                      } print:bg-gray-500`}></span>
                                      <span className="text-sm text-gray-700">{item}</span>
                                      {i < completedItems && (
                                        <svg className="w-3 h-3 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 print:bg-gray-50">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-green-800 print:text-gray-800 flex items-center">
                                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 print:bg-gray-500">A</span>
                                  Paschat Karma (Post-care)
                                </h4>
                                <div className="flex items-center space-x-2 print:hidden">
                                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                    {getKarmaDaysProgress(therapy, 'paschatkarma').completedDays}/{getKarmaDaysProgress(therapy, 'paschatkarma').assignedDays} days
                                  </span>
                                  <button
                                    onClick={() => updateKarmaProgress(index, 'paschatkarma', 'complete')}
                                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded text-xs"
                                    disabled={isKarmaComplete(therapy, 'paschatkarma')}
                                    title="Complete Next Item"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => updateKarmaProgress(index, 'paschatkarma', 'extend')}
                                    className="bg-green-400 hover:bg-green-500 text-white p-1 rounded text-xs"
                                    title="Add 1 Day to Post-care Phase"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Progress Bar for Paschat Karma */}
                              <div className="mb-3">
                                <div className="w-full bg-green-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      isKarmaComplete(therapy, 'paschatkarma') ? 'bg-green-600' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${getKarmaProgressPercentage(therapy, 'paschatkarma')}%` }}
                                  ></div>
                                </div>
                                {isKarmaComplete(therapy, 'paschatkarma') && (
                                  <div className="flex items-center mt-1 text-green-600">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs font-medium">Post-care Complete</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {therapy.paschatkarma.map((item, i) => {
                                  const { completedDays, assignedDays } = getKarmaDaysProgress(therapy, 'paschatkarma');
                                  const itemsPerDay = Math.ceil(therapy.paschatkarma.length / assignedDays);
                                  const completedItems = Math.min(completedDays * itemsPerDay, therapy.paschatkarma.length);
                                  const currentItem = Math.min(completedItems, therapy.paschatkarma.length - 1);
                                  
                                  return (
                                    <div key={i} className={`flex items-center p-2 rounded border border-green-200 transition-all duration-300 ${
                                      i < completedItems
                                        ? 'bg-green-100 border-green-300' 
                                        : i === currentItem && completedDays < assignedDays
                                        ? 'bg-green-200 border-green-400 ring-2 ring-green-300'
                                        : 'bg-white'
                                    }`}>
                                      <span className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                                        i < completedItems
                                          ? 'bg-green-500'
                                          : i === currentItem && completedDays < assignedDays
                                          ? 'bg-green-500 animate-pulse'
                                          : 'bg-gray-300'
                                      } print:bg-gray-500`}></span>
                                      <span className="text-sm text-gray-700">{item}</span>
                                      {i < completedItems && (
                                        <svg className="w-3 h-3 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Therapy Schedule Section */}
                        {therapy.startDate && (
                          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 print:bg-gray-50 relative">
                            {/* Edit Button - Hide on print */}
                            <button
                              onClick={() => toggleEditDate(index)}
                              className="absolute top-3 right-3 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200 print:hidden"
                              title="Edit Start Date"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            <h4 className="font-semibold text-blue-800 mb-3 print:text-gray-800 flex items-center pr-8">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Therapy Schedule
                            </h4>

                            {/* Date Editing Mode */}
                            {therapy.isEditingDate && (
                              <div className="mb-4 p-3 bg-white rounded-lg border border-blue-300 print:hidden">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Select New Start Date
                                    </label>
                                    <input
                                      type="date"
                                      defaultValue={formatDateForInput(therapy.startDate)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          const newDate = new Date(e.target.value).toISOString();
                                          updateStartDate(index, newDate);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => toggleEditDate(index)}
                                      className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded border border-blue-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-semibold text-gray-600">Start Date</span>
                                </div>
                                <p className="text-sm text-gray-800 font-medium">{formatStartDate(therapy.startDate)}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-blue-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-semibold text-gray-600">Expected End Date</span>
                                </div>
                                <p className="text-sm text-gray-800 font-medium">{calculateEndDate(therapy.startDate, therapy.totalDays || 7)}</p>
                              </div>
                            </div>
                            <div className="mt-3 bg-white p-3 rounded border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  <span className="text-sm font-semibold text-gray-600">Duration</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-800 font-medium">{therapy.totalDays || 7} days total</p>
                                  <p className="text-xs text-gray-500">
                                    {getCompletedDays(therapy)} days completed, {getRemainingDays(therapy)} remaining
                                  </p>
                                  <p className="text-xs text-blue-600 mt-1">
                                    Karma breakdown: {therapy.purvakarmaDays || 2} + {therapy.pradhanakarmaaDays || 4} + {therapy.paschatkarmaaDays || 1} = {getTotalKarmaDays(therapy)} days
                                  </p>
                                  <p className="text-xs text-purple-600">
                                    Current: Day {therapy.currentDay || 1}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medications */}
            {prescriptionData.medications.length > 0 && (
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 print:bg-gray-50">
                <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Prescribed Medications
                </h2>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prescriptionData.medications.map((medication, index) => (
                      <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg print:bg-gray-50">
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 print:bg-gray-600">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 font-medium">{medication}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pre Requirements */}
              {prescriptionData.preRequirements && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 print:bg-gray-50 print:break-inside-avoid">
                  <h2 className="text-2xl font-semibold text-orange-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Pre-Treatment Requirements
                  </h2>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{prescriptionData.preRequirements}</p>
                  </div>
                </div>
              )}

              {/* Post Requirements */}
              {prescriptionData.postRequirements && (
                <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 print:bg-gray-50 print:break-inside-avoid">
                  <h2 className="text-2xl font-semibold text-teal-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Post-Treatment Requirements
                  </h2>
                  <div className="bg-white p-4 rounded-lg border border-teal-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{prescriptionData.postRequirements}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor's Signature Area */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Prescribed by:</p>
                  <div className="h-16 border-b border-gray-300 w-64 flex items-end">
                    <p className="text-sm text-gray-500">Doctor's Signature</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-2">Date:</p>
                  <p className="font-medium text-gray-800">{new Date(prescriptionData.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
              <p>This prescription is generated electronically and is valid for the treatment period specified.</p>
              <p className="mt-1">For any queries, please contact your Ayurvedic practitioner.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}