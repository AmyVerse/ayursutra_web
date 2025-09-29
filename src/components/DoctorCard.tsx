import { useState } from "react";

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

interface DoctorCardProps {
  doctor: Doctor;
  patientAyursutraId?: string; // Patient's AyurSutra ID for sending notifications
}

export default function DoctorCard({
  doctor,
  patientAyursutraId,
}: DoctorCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  const handleBookAppointment = async () => {
    if (!patientAyursutraId) {
      alert("Please log in to book an appointment");
      return;
    }

    setIsBooking(true);
    setBookingStatus(null);

    try {
      // Send simple appointment request notification
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderAyursutraId: patientAyursutraId,
          receiverAyursutraId: doctor.ayursutraId,
          type: "appointment_request",
          title: "New Appointment Request",
          message: `Patient ${patientAyursutraId} has requested an appointment with you.`,
          data: JSON.stringify({
            doctorId: doctor.id,
            doctorName: doctor.name,
            patientAyursutraId: patientAyursutraId,
            requestedAt: new Date().toISOString(),
          }),
          priority: "high",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingStatus("✅ Appointment request sent!");
        setTimeout(() => setBookingStatus(null), 3000);
      } else {
        setBookingStatus("❌ Failed to send request");
        setTimeout(() => setBookingStatus(null), 3000);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingStatus("❌ Error occurred");
      setTimeout(() => setBookingStatus(null), 3000);
    } finally {
      setIsBooking(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-emerald-600 font-medium">
            {doctor.specialization}
          </p>
          <p className="text-sm text-gray-600">{doctor.location}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
          </div>
          {doctor.isVerified && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Experience:</span>
            <span className="ml-2 font-medium">
              {doctor.experience.includes("year")
                ? doctor.experience
                : `${doctor.experience} years`}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Patients:</span>
            <span className="ml-2 font-medium">{doctor.patientsChecked}+</span>
          </div>
        </div>
      </div>

      {doctor.biography && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {doctor.biography}
        </p>
      )}

      <div className="space-y-2">
        <button
          onClick={handleBookAppointment}
          disabled={isBooking || !patientAyursutraId}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            patientAyursutraId
              ? "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          {isBooking
            ? "Sending Request..."
            : patientAyursutraId
              ? "📅 Request Appointment"
              : "📅 Login to Book"}
        </button>

        {bookingStatus && (
          <p
            className={`text-sm text-center ${
              bookingStatus.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {bookingStatus}
          </p>
        )}

        <div className="text-xs text-gray-500 text-center mt-2">
          Doctor ID: {doctor.ayursutraId}
        </div>
      </div>
    </div>
  );
}
