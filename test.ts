import "dotenv/config";
import { getUserByAyurSutraId } from "./src/lib/ayursutra-id";
import { db } from "./src/lib/db";
import { appointments } from "./src/lib/db/schema";
import { generateAppointmentId } from "./src/lib/ayursutra-id";

async function test() {
  try {
    const patientAyursutraId = "demo-pat-456";
    const doctorAyursutraId = "demo-dr-123";

    console.log("Fetching users...");
    const patientUser = await getUserByAyurSutraId(patientAyursutraId);
    const doctorUser = await getUserByAyurSutraId(doctorAyursutraId);

    console.log("Patient User:", patientUser);
    console.log("Doctor User:", doctorUser);

    if (!patientUser || !doctorUser) {
        console.log("Missing users. Creating them or updating script to use actual IDs.");
    }

    const patientId = patientUser?.id || 1; 
    const doctorId = doctorUser?.id || 2;

    const appointmentId = await generateAppointmentId();
    
    console.log("Attempting insert...");
    const appointment = await db
      .insert(appointments)
      .values({
        appointmentId,
        patientId,
        doctorId,
        patientAyursutraId,
        doctorAyursutraId,
        dateTime: new Date("2026-05-01T10:00:00Z"),
        notes: "Testing",
        treatmentType: "Consultation",
        duration: 60,
        status: "pending",
      })
      .returning();
      
    console.log("Success!", appointment);
  } catch (error) {
    console.error("Error occurred:");
    console.error(error);
  }
}

test();
