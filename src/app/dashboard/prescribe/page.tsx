'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TherapyData {
  [key: string]: {
    "Purvakarma (Preparation)": string[];
    "Pradhana Karma (Main)": string[];
    "Paschat Karma (Post-care)": string[];
  };
}

interface SelectedTherapy {
  therapy: string;
  purvakarma: string[];
  pradhanakarma: string[];
  paschatkarma: string[];
}

const therapyData: { "Panchakarma Therapies": TherapyData } = {
  "Panchakarma Therapies": {
    "Vamana (Therapeutic Emesis)": {
      "Purvakarma (Preparation)": [
        "Deepana",
        "Pachana",
        "Snehana",
        "Swedana",
        "Kapha-aggravating diet"
      ],
      "Pradhana Karma (Main)": [
        "Vamana"
      ],
      "Paschat Karma (Post-care)": [
        "Samsarjana Krama",
        "Rest",
        "Lifestyle restrictions"
      ]
    },
    "Virechana (Therapeutic Purgation)": {
      "Purvakarma (Preparation)": [
        "Deepana",
        "Pachana",
        "Snehana",
        "Swedana"
      ],
      "Pradhana Karma (Main)": [
        "Virechana"
      ],
      "Paschat Karma (Post-care)": [
        "Samsarjana Krama",
        "Rest",
        "Lifestyle care"
      ]
    },
    "Basti (Medicated Enema)": {
      "Purvakarma (Preparation)": [
        "Abhyanga",
        "Swedana"
      ],
      "Pradhana Karma (Main)": [
        "Anuvasana Basti",
        "Niruha Basti",
        "Matra Basti",
        "Uttara Basti",
        "Piccha Basti",
        "Guda Basti"
      ],
      "Paschat Karma (Post-care)": [
        "Light diet",
        "Avoid exertion",
        "Follow-up Basti course"
      ]
    },
    "Nasya (Nasal Therapy)": {
      "Purvakarma (Preparation)": [
        "Abhyanga",
        "Swedana"
      ],
      "Pradhana Karma (Main)": [
        "Pradhamana Nasya",
        "Bruhmana Nasya",
        "Shamana Nasya",
        "Recana Nasya",
        "Avapeedana Nasya",
        "Dhuma Nasya"
      ],
      "Paschat Karma (Post-care)": [
        "Gargling",
        "Dhumapana",
        "Rest"
      ]
    },
    "Raktamokshana (Bloodletting)": {
      "Purvakarma (Preparation)": [
        "Snehana",
        "Swedana"
      ],
      "Pradhana Karma (Main)": [
        "Siravedha",
        "Jalaukavacharana",
        "Pracchana",
        "Alabu",
        "Shrunga"
      ],
      "Paschat Karma (Post-care)": [
        "Wound dressing",
        "Diet regulation",
        "Rest"
      ]
    }
  }
};

// Suggested medications based on therapies
const suggestedMedications: { [key: string]: string[] } = {
  "Vamana (Therapeutic Emesis)": [
    "Madanaphala Rasayana",
    "Vacha Churna",
    "Pippali Churna",
    "Saindhava Lavana",
    "Honey",
    "Ghrita",
    "Milk"
  ],
  "Virechana (Therapeutic Purgation)": [
    "Triphala Churna",
    "Castor Oil",
    "Trivrit Lehya",
    "Abhayarishta",
    "Draksha",
    "Milk",
    "Ghrita"
  ],
  "Basti (Medicated Enema)": [
    "Dashamoola Kwatha",
    "Tila Taila",
    "Sahacharadi Taila",
    "Ksheerabala Taila",
    "Madhutailika Basti",
    "Yapana Basti Yoga",
    "Anuvasana Taila"
  ],
  "Nasya (Nasal Therapy)": [
    "Anu Taila",
    "Shadbindu Taila",
    "Brahmi Ghrita",
    "Ksheerabala Taila",
    "Cow's Ghee",
    "Tikta Ghrita",
    "Panchendriya Vardhan Rasa"
  ],
  "Raktamokshana (Bloodletting)": [
    "Sarivadyasava",
    "Manjisthadi Kwatha",
    "Khadirarishta",
    "Triphala Kwatha",
    "Nimba Churna",
    "Haridra Churna",
    "Raktashodhak Syrup"
  ]
};

export default function AddPrescription() {
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [selectedTherapies, setSelectedTherapies] = useState<SelectedTherapy[]>([]);
  const [medications, setMedications] = useState(['']);
  const [preRequirements, setPreRequirements] = useState('');
  const [postRequirements, setPostRequirements] = useState('');

  const addTherapy = () => {
    setSelectedTherapies([...selectedTherapies, {
      therapy: '',
      purvakarma: [],
      pradhanakarma: [],
      paschatkarma: []
    }]);
  };

  const removeTherapy = (index: number) => {
    setSelectedTherapies(selectedTherapies.filter((_, i) => i !== index));
  };

  const updateTherapy = (index: number, therapy: string) => {
    const updated = [...selectedTherapies];
    updated[index] = {
      therapy,
      purvakarma: [],
      pradhanakarma: [],
      paschatkarma: []
    };
    setSelectedTherapies(updated);
  };

  const updateTherapySection = (
    therapyIndex: number,
    section: 'purvakarma' | 'pradhanakarma' | 'paschatkarma',
    value: string,
    checked: boolean
  ) => {
    const updated = [...selectedTherapies];
    if (checked) {
      updated[therapyIndex][section] = [...updated[therapyIndex][section], value];
    } else {
      updated[therapyIndex][section] = updated[therapyIndex][section].filter(item => item !== value);
    }
    setSelectedTherapies(updated);
  };

  const addMedication = () => {
    setMedications([...medications, '']);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, value: string) => {
    const updated = [...medications];
    updated[index] = value;
    setMedications(updated);
  };

  // Get suggested medications based on selected therapies
  const getSuggestedMedications = () => {
    const suggestions: string[] = [];
    selectedTherapies.forEach(therapy => {
      if (therapy.therapy && suggestedMedications[therapy.therapy]) {
        suggestions.push(...suggestedMedications[therapy.therapy]);
      }
    });
    // Remove duplicates
    return [...new Set(suggestions)];
  };

  const addSuggestedMedication = (medication: string) => {
    if (!medications.includes(medication)) {
      setMedications([...medications.filter(med => med.trim() !== ''), medication]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prescriptionData = {
      patientName,
      patientId,
      therapies: selectedTherapies,
      medications: medications.filter(med => med.trim() !== ''),
      preRequirements,
      postRequirements,
      date: new Date().toISOString()
    };
    
    // Navigate to prescription view page with data
    const dataString = encodeURIComponent(JSON.stringify(prescriptionData));
    router.push(`/dashboard/prescription-view?data=${dataString}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-green-100">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl">
            <h1 className="text-3xl font-bold text-center">Add Prescription</h1>
            <p className="text-center text-green-100 mt-2">Ayurvedic Treatment Prescription Form</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Patient Information */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="patientId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    id="patientId"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Therapy Selection */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Therapy Selection
                </h2>
                <button
                  type="button"
                  onClick={addTherapy}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Therapy
                </button>
              </div>

              {selectedTherapies.map((therapy, therapyIndex) => (
                <div key={therapyIndex} className="bg-white p-6 rounded-lg border border-blue-200 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Therapy {therapyIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeTherapy(therapyIndex)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Therapy Selection Dropdown */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Therapy
                    </label>
                    <select
                      value={therapy.therapy}
                      onChange={(e) => updateTherapy(therapyIndex, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a therapy...</option>
                      {Object.keys(therapyData["Panchakarma Therapies"]).map(therapyName => (
                        <option key={therapyName} value={therapyName}>
                          {therapyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Therapy Sections */}
                  {therapy.therapy && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Purvakarma */}
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-800 mb-3">Purvakarma (Preparation)</h4>
                        
                        {/* Selected Purvakarma Items */}
                        {therapy.purvakarma.length > 0 && (
                          <div className="mb-4 p-3 bg-yellow-100 rounded-md border border-yellow-300">
                            <p className="text-xs font-medium text-yellow-800 mb-2">Selected:</p>
                            <div className="flex flex-wrap gap-1">
                              {therapy.purvakarma.map(item => (
                                <span key={item} className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          {therapyData["Panchakarma Therapies"][therapy.therapy]["Purvakarma (Preparation)"].map(item => (
                            <label key={item} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={therapy.purvakarma.includes(item)}
                                onChange={(e) => updateTherapySection(therapyIndex, 'purvakarma', item, e.target.checked)}
                                className="mr-2 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                              />
                              <span className="text-sm text-gray-700">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Pradhana Karma */}
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-3">Pradhana Karma (Main)</h4>
                        
                        {/* Selected Pradhana Karma Items */}
                        {therapy.pradhanakarma.length > 0 && (
                          <div className="mb-4 p-3 bg-red-100 rounded-md border border-red-300">
                            <p className="text-xs font-medium text-red-800 mb-2">Selected:</p>
                            <div className="flex flex-wrap gap-1">
                              {therapy.pradhanakarma.map(item => (
                                <span key={item} className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          {therapyData["Panchakarma Therapies"][therapy.therapy]["Pradhana Karma (Main)"].map(item => (
                            <label key={item} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={therapy.pradhanakarma.includes(item)}
                                onChange={(e) => updateTherapySection(therapyIndex, 'pradhanakarma', item, e.target.checked)}
                                className="mr-2 rounded border-red-300 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-700">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Paschat Karma */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3">Paschat Karma (Post-care)</h4>
                        
                        {/* Selected Paschat Karma Items */}
                        {therapy.paschatkarma.length > 0 && (
                          <div className="mb-4 p-3 bg-green-100 rounded-md border border-green-300">
                            <p className="text-xs font-medium text-green-800 mb-2">Selected:</p>
                            <div className="flex flex-wrap gap-1">
                              {therapy.paschatkarma.map(item => (
                                <span key={item} className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          {therapyData["Panchakarma Therapies"][therapy.therapy]["Paschat Karma (Post-care)"].map(item => (
                            <label key={item} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={therapy.paschatkarma.includes(item)}
                                onChange={(e) => updateTherapySection(therapyIndex, 'paschatkarma', item, e.target.checked)}
                                className="mr-2 rounded border-green-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="text-sm text-gray-700">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {selectedTherapies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No therapies selected. Click "Add Therapy" to begin.</p>
                </div>
              )}
            </div>

            {/* Medications */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-purple-800 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Medications
                </h2>
                <button
                  type="button"
                  onClick={addMedication}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Custom Medication
                </button>
              </div>

              {/* Suggested Medications */}
              {selectedTherapies.length > 0 && getSuggestedMedications().length > 0 && (
                <div className="mb-6 p-4 bg-purple-100 rounded-lg border border-purple-300">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Suggested Medications (Based on Selected Therapies)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {getSuggestedMedications().map(medication => (
                      <button
                        key={medication}
                        type="button"
                        onClick={() => addSuggestedMedication(medication)}
                        className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                          medications.includes(medication)
                            ? 'bg-purple-200 border-purple-400 text-purple-800'
                            : 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
                        }`}
                        disabled={medications.includes(medication)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{medication}</span>
                          {medications.includes(medication) ? (
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-purple-600 mt-3">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click on any suggested medication to add it to your prescription. You can still add custom medications below.
                  </p>
                </div>
              )}

              {/* Custom Medication Inputs */}
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Custom Medications
                </h3>
                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={medication}
                          onChange={(e) => updateMedication(index, e.target.value)}
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={`Medication ${index + 1} (or select from suggestions above)`}
                        />
                      </div>
                      {medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pre Requirements */}
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <h2 className="text-2xl font-semibold text-orange-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Pre Requirements
                </h2>
                <textarea
                  value={preRequirements}
                  onChange={(e) => setPreRequirements(e.target.value)}
                  className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={6}
                  placeholder="Enter pre-treatment requirements, diet restrictions, preparations, etc."
                />
              </div>

              {/* Post Requirements */}
              <div className="bg-teal-50 p-6 rounded-xl border border-teal-200">
                <h2 className="text-2xl font-semibold text-teal-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Post Requirements
                </h2>
                <textarea
                  value={postRequirements}
                  onChange={(e) => setPostRequirements(e.target.value)}
                  className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={6}
                  placeholder="Enter post-treatment care, follow-up instructions, lifestyle modifications, etc."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-12 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Prescription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}