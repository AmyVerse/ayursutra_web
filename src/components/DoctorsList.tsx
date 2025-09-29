"use client";

import DoctorCard from "@/components/DoctorCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string; // Changed to string to match schema
  patientsChecked: number;
  rating: string;
  biography?: string;
  location: string;
  ayursutraId: string;
  isVerified: boolean;
}

export default function DoctorsList() {
  const { data: session } = useSession();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");

  // Mock data for demonstration (replace with actual API call)
  useEffect(() => {
    const mockDoctors: Doctor[] = [
      {
        id: 1,
        name: "Dr. Rajesh Kumar",
        specialization: "Ayurvedic Medicine",
        experience: "15",
        patientsChecked: 5000,
        rating: "4.8",
        biography:
          "Specialized in traditional Ayurvedic treatments with modern diagnostic approaches. Expert in Panchakarma and herbal medicine.",
        location: "Mumbai, Maharashtra",
        ayursutraId: "AS-D-12345",
        isVerified: true,
      },
      {
        id: 2,
        name: "Dr. Priya Sharma",
        specialization: "Ayurvedic Dermatology",
        experience: "12",
        patientsChecked: 3500,
        rating: "4.7",
        biography:
          "Expert in skin and hair treatments using traditional Ayurvedic methods. Specialized in treating chronic skin conditions.",
        location: "Delhi, India",
        ayursutraId: "AS-D-12346",
        isVerified: true,
      },
      {
        id: 3,
        name: "Dr. Amit Patel",
        specialization: "Panchakarma Specialist",
        experience: "20",
        patientsChecked: 7500,
        rating: "4.9",
        biography:
          "Leading expert in Panchakarma treatments and detoxification therapies. Over 20 years of experience in Ayurvedic medicine.",
        location: "Pune, Maharashtra",
        ayursutraId: "AS-D-12347",
        isVerified: true,
      },
    ];

    // Simulate API loading
    setTimeout(() => {
      setDoctors(mockDoctors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      (searchTerm === "" ||
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (specialization === "" ||
        doctor.specialization
          .toLowerCase()
          .includes(specialization.toLowerCase())) &&
      (location === "" ||
        doctor.location.toLowerCase().includes(location.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Ayurvedic Doctors
          </h1>
          <p className="text-gray-600 mb-6">
            Book appointments and send notifications directly to doctors using
            their AyurSutra IDs
          </p>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Doctors
                </label>
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Specializations</option>
                  <option value="Ayurvedic Medicine">Ayurvedic Medicine</option>
                  <option value="Ayurvedic Dermatology">
                    Ayurvedic Dermatology
                  </option>
                  <option value="Panchakarma">Panchakarma Specialist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Flow Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🔔 Notification Flow
            </h3>
            <p className="text-blue-800 text-sm">
              When you click "Book Appointment", here's what happens:
            </p>
            <ol className="list-decimal list-inside text-blue-800 text-sm mt-2 space-y-1">
              <li>
                <strong>Button Click</strong> → Triggers notification creation
              </li>
              <li>
                <strong>Store in Database</strong> → Notification saved with
                unique ID (AS-NOT-12345)
              </li>
              <li>
                <strong>AyurSutra ID Targeting</strong> → Sent to doctor's
                AyurSutra ID (AS-D-12345)
              </li>
              <li>
                <strong>Ably Real-time Push</strong> → Will push to doctor's
                channel "doctor_AS-D-12345"
              </li>
              <li>
                <strong>Doctor Receives</strong> → Real-time notification in
                their dashboard
              </li>
            </ol>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              patientAyursutraId={
                (session?.user as any)?.ayursutraId || "AS-P-12345"
              } // Mock patient ID
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No doctors found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
