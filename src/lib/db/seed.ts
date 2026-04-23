import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log("🌱 Seeding started...");

  // Clear existing data to avoid unique constraint errors and ensure a clean state
  console.log("🧹 Cleaning existing data...");
  await db.delete(schema.appointments);
  await db.delete(schema.notifications);
  await db.delete(schema.doctors);
  await db.delete(schema.users);

  // 1. Create Patients
  console.log("👤 Creating patients...");
  const patients = await db.insert(schema.users).values([
    {
      name: "Amulya Sharma",
      email: "amulya@example.com",
      phone: "9876543210",
      role: "patient",
      ayursutraId: "AS-P-1001",
      age: 24,
    },
    {
      name: "Rahul Kumar",
      email: "rahul@example.com",
      phone: "9876543211",
      role: "patient",
      ayursutraId: "AS-P-1002",
      age: 30,
    },
    {
      name: "Priyanka Gupta",
      email: "priyanka@example.com",
      phone: "9876543214",
      role: "patient",
      ayursutraId: "AS-P-1003",
      age: 27,
    },
    {
      name: "Karan Malhotra",
      email: "karan@example.com",
      phone: "9876543216",
      role: "patient",
      ayursutraId: "AS-P-1004",
      age: 32,
    },
    {
      name: "Sneha Reddy",
      email: "sneha@example.com",
      phone: "9876543217",
      role: "patient",
      ayursutraId: "AS-P-1005",
      age: 29,
    },
  ]).returning();

  // 2. Create Doctors
  console.log("👨‍⚕️ Creating doctor users...");
  const doctorUsers = await db.insert(schema.users).values([
    {
      name: "Dr. Anjali Verma",
      email: "anjali@ayursutra.in",
      phone: "9876543212",
      role: "doctor",
      ayursutraId: "AS-D-2001",
      age: 35,
    },
    {
      name: "Dr. Vikram Singh",
      email: "vikram@ayursutra.in",
      phone: "9876543213",
      role: "doctor",
      ayursutraId: "AS-D-2002",
      age: 42,
    },
    {
      name: "Dr. Sameer Khan",
      email: "sameer@ayursutra.in",
      phone: "9876543215",
      role: "doctor",
      ayursutraId: "AS-D-2003",
      age: 38,
    },
    {
      name: "Dr. Rajesh Khanna",
      email: "rajesh@ayursutra.in",
      phone: "9876543218",
      role: "doctor",
      ayursutraId: "AS-D-2004",
      age: 45,
    },
    {
      name: "Dr. Sunita Menon",
      email: "sunita@ayursutra.in",
      phone: "9876543219",
      role: "doctor",
      ayursutraId: "AS-D-2005",
      age: 40,
    },
    {
      name: "Dr. Amit Patel",
      email: "amit@ayursutra.in",
      phone: "9876543220",
      role: "doctor",
      ayursutraId: "AS-D-2006",
      age: 37,
    },
  ]).returning();

  // 3. Create Doctor Profiles
  console.log("📄 Creating doctor profiles...");
  await db.insert(schema.doctors).values([
    {
      ayursutraId: "AS-D-2001",
      name: "Dr. Anjali Verma",
      specialization: "General Ayurvedic Medicine",
      experience: "10",
      location: "New Delhi",
      biography: "Expert in Panchakarma and lifestyle disorders with over 10 years of experience in classical Ayurvedic treatments.",
      rating: "4.8",
      patientsChecked: 1500,
      isVerified: true,
      hprId: "HPR-1001",
    },
    {
      ayursutraId: "AS-D-2002",
      name: "Dr. Vikram Singh",
      specialization: "Ayurvedic Pediatrics",
      experience: "15",
      location: "Mumbai",
      biography: "Specializes in child healthcare, immunity building, and nutrition through traditional Ayurvedic principles.",
      rating: "4.9",
      patientsChecked: 2200,
      isVerified: true,
      hprId: "HPR-1002",
    },
    {
      ayursutraId: "AS-D-2003",
      name: "Dr. Sameer Khan",
      specialization: "Dermatology & Skin Care",
      experience: "13",
      location: "Bangalore",
      biography: "Focuses on natural remedies for chronic skin conditions and holistic wellness.",
      rating: "4.7",
      patientsChecked: 950,
      isVerified: true,
      hprId: "HPR-1003",
    },
    {
      ayursutraId: "AS-D-2004",
      name: "Dr. Rajesh Khanna",
      specialization: "Ayurvedic Orthopedics",
      experience: "20",
      location: "Chennai",
      biography: "Legendary practitioner focusing on joint pains, bone health, and traditional MARMA therapy.",
      rating: "4.9",
      patientsChecked: 3500,
      isVerified: true,
      hprId: "HPR-1004",
    },
    {
      ayursutraId: "AS-D-2005",
      name: "Dr. Sunita Menon",
      specialization: "Women Health & Gynaecology",
      experience: "12",
      location: "Kochi",
      biography: "Expert in hormonal balance and maternal care using traditional Kerala Ayurvedic techniques.",
      rating: "4.8",
      patientsChecked: 1800,
      isVerified: true,
      hprId: "HPR-1005",
    },
    {
      ayursutraId: "AS-D-2006",
      name: "Dr. Amit Patel",
      specialization: "Ayurvedic Neurology",
      experience: "9",
      location: "Pune",
      biography: "Specializes in stress management, sleep disorders, and cognitive wellness through Ayurveda.",
      rating: "4.6",
      patientsChecked: 720,
      isVerified: true,
      hprId: "HPR-1006",
    },
  ]);

  // 4. Create sample appointments
  console.log("📅 Creating sample appointments...");
  if (patients[0] && doctorUsers[0]) {
    await db.insert(schema.appointments).values([
      {
        appointmentId: "AS-APT-3001",
        patientId: patients[0].id,
        doctorId: doctorUsers[0].id,
        patientAyursutraId: patients[0].ayursutraId!,
        doctorAyursutraId: doctorUsers[0].ayursutraId!,
        dateTime: new Date(Date.now() + 86400000), // Tomorrow
        status: "confirmed",
        treatmentType: "Consultation",
        notes: "Initial checkup for chronic back pain and digestion issues.",
      },
      {
        appointmentId: "AS-APT-3002",
        patientId: patients[1].id,
        doctorId: doctorUsers[1].id,
        patientAyursutraId: patients[1].ayursutraId!,
        doctorAyursutraId: doctorUsers[1].ayursutraId!,
        dateTime: new Date(Date.now() + 172800000), // Day after tomorrow
        status: "pending",
        treatmentType: "Follow-up",
        notes: "Regular checkup for seasonal allergies.",
      }
    ]);
  }

  // 5. Create some notifications
  console.log("🔔 Creating sample notifications...");
  if (patients[0] && doctorUsers[0]) {
    await db.insert(schema.notifications).values([
      {
        notificationId: "AS-NOT-4001",
        senderAyursutraId: doctorUsers[0].ayursutraId!,
        receiverAyursutraId: patients[0].ayursutraId!,
        type: "appointment_confirmed",
        title: "Appointment Confirmed",
        message: "Your appointment with Dr. Anjali Verma has been confirmed for tomorrow.",
        status: "unread",
        priority: "high",
        createdAt: new Date(),
      },
      {
        notificationId: "AS-NOT-4002",
        senderAyursutraId: patients[1].ayursutraId!,
        receiverAyursutraId: doctorUsers[1].ayursutraId!,
        type: "appointment_request",
        title: "New Appointment Request",
        message: "Rahul Kumar has requested an appointment for follow-up.",
        status: "unread",
        priority: "medium",
        createdAt: new Date(),
      }
    ]);
  }

  console.log("✅ Seeding completed successfully!");
}

main().catch((err) => {
  console.error("❌ Seeding failed");
  console.error(err);
  process.exit(1);
});
