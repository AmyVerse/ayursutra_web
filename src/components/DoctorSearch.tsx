"use client";

import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  patientsChecked: number;
  rating: string;
  biography?: string;
  location: string;
  ayursutraId: string;
  isVerified: boolean;
}

interface DoctorSearchProps {
  patientAyursutraId?: string;
}

export default function DoctorSearch({
  patientAyursutraId,
}: DoctorSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors from API
  const fetchDoctors = async (searchQuery?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(`/api/doctors?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        setError(data.error || "Failed to fetch doctors");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching doctors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      await fetchDoctors(searchTerm);
      setIsSearching(false);
    }
  };

  // Filter doctors based on search term (client-side filtering for additional responsiveness)
  const filteredDoctors = doctors.filter((doctor: Doctor) => {
    if (!searchTerm.trim()) return true; // Show all doctors when no search term
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Find Ayurvedic Doctors
        </h2>

        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, specialization, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim() || isSearching}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Quick filter buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setSearchTerm("Panchakarma");
              fetchDoctors("Panchakarma");
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
          >
            Panchakarma
          </button>
          <button
            onClick={() => {
              setSearchTerm("Dermatology");
              fetchDoctors("Dermatology");
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
          >
            Skin Care
          </button>
          <button
            onClick={() => {
              setSearchTerm("Mumbai");
              fetchDoctors("Mumbai");
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
          >
            Mumbai
          </button>
          <button
            onClick={() => {
              setSearchTerm("Delhi");
              fetchDoctors("Delhi");
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
          >
            Delhi
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {searchTerm.trim() ? "Search Results" : "Available Doctors"}{" "}
            {filteredDoctors.length > 0 &&
              `(${filteredDoctors.length} doctors found)`}
          </h3>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                fetchDoctors(); // Reload all doctors
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Clear search
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => fetchDoctors(searchTerm)}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading || isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              {isSearching ? "Searching for doctors..." : "Loading doctors..."}
            </p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor: Doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                patientAyursutraId={patientAyursutraId}
              />
            ))}
          </div>
        ) : !error ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm.trim() ? "No doctors found" : "No doctors available"}
            </h3>
            <p className="text-gray-600">
              {searchTerm.trim()
                ? 'Try searching with different keywords like "Panchakarma", "Mumbai", or "Dermatology"'
                : "There are currently no verified doctors in the system."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
