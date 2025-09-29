import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Users table for patients and doctors
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  ayursutraId: text("ayursutra_id").unique(), // AS-D-12132 or AS-P-12334 (generated later)
  email: text("email"),
  phone: text("phone"),
  name: text("name"),
  role: text("role").$type<"patient" | "doctor">().notNull().default("patient"),
  emailVerified: timestamp("email_verified"),
  phoneVerified: timestamp("phone_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Doctor-specific information
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  ayursutraId: text("ayursutra_id")
    .references(() => users.ayursutraId)
    .notNull(), // Reference to user's AyurSutra ID
  name: text("name").notNull(), // Doctor's full name
  specialization: text("specialization").notNull(), // e.g., "Ayurvedic Medicine", "Dermatology"
  experience: text("experience").notNull().default("0"), // Keep as text to avoid casting issues
  patientsChecked: integer("patients_checked").notNull().default(0), // Total patients treated
  rating: text("rating").default("4.5"), // Keep as text to avoid casting issues
  biography: text("biography"), // Doctor's bio/description
  location: text("location").notNull(), // City/State/Region
  hprId: text("hpr_id"), // Health Professional Registry ID
  abhaId: text("abha_id"), // Ayushman Bharat Health Account ID
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// OTP verification table
export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(), // email or phone
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  appointmentId: text("appointment_id").unique().notNull(), // AS-APT-12345
  patientId: integer("patient_id")
    .references(() => users.id)
    .notNull(),
  doctorId: integer("doctor_id")
    .references(() => users.id)
    .notNull(),
  patientAyursutraId: text("patient_ayursutra_id").notNull(), // For quick lookup
  doctorAyursutraId: text("doctor_ayursutra_id").notNull(), // For quick lookup
  dateTime: timestamp("date_time").notNull(),
  status: text("status")
    .$type<
      "confirmed" | "pending" | "cancelled" | "completed" | "rescheduled"
    >()
    .default("pending"),
  notes: text("notes"),
  treatmentType: text("treatment_type"), // Panchakarma, Consultation, etc.
  duration: integer("duration").default(60), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  notificationId: text("notification_id").unique().notNull(), // AS-NOT-12345
  senderAyursutraId: text("sender_ayursutra_id").notNull(), // Who sent the notification
  receiverAyursutraId: text("receiver_ayursutra_id").notNull(), // Who receives the notification
  type: text("type")
    .$type<
      | "appointment_request"
      | "appointment_confirmed"
      | "appointment_cancelled"
      | "appointment_rescheduled"
      | "appointment_reminder"
      | "treatment_update"
      | "prescription_ready"
      | "general"
    >()
    .notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: text("data"), // JSON string for additional data (appointmentId, etc.)
  status: text("status")
    .$type<"unread" | "read" | "archived">()
    .default("unread"),
  priority: text("priority")
    .$type<"low" | "medium" | "high" | "urgent">()
    .default("medium"),
  scheduledFor: timestamp("scheduled_for"), // For scheduled notifications
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Auth.js required tables
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
});
