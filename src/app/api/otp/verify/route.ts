import { db } from "@/lib/db";
import { doctors, users } from "@/lib/db/schema";
import { verifyOTP } from "@/lib/otp";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const verifyOTPSchema = z.object({
  identifier: z.string().min(1, "Phone or email is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  isDoctor: z.boolean().optional().default(false),
  hprId: z.string().optional(),
  abhaId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, otp, isDoctor, hprId, abhaId } =
      verifyOTPSchema.parse(body);

    // Verify OTP first
    const isValidOTP = await verifyOTP(identifier, otp);
    if (!isValidOTP) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes("@");

    // Check if user exists in database
    let existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, identifier), eq(users.phone, identifier)))
      .limit(1);

    if (existingUser.length > 0) {
      // User exists - redirect based on their role
      const user = existingUser[0];

      // Update verification status
      await db
        .update(users)
        .set({
          emailVerified: isEmail ? new Date() : user.emailVerified,
          phoneVerified: isEmail ? user.phoneVerified : new Date(),
        })
        .where(eq(users.id, user.id));

      // Determine redirect URL based on existing user role
      const redirectUrl =
        user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient";

      return NextResponse.json({
        success: true,
        userId: user.id,
        role: user.role,
        redirectUrl,
        message: `Welcome back!`,
      });
    }

    // User doesn't exist - create new user OR link to existing doctor by HPR ID
    if (isDoctor && hprId) {
      // Check if HPR ID already exists in our doctors pool
      const existingDoctorProfile = await db
        .select()
        .from(doctors)
        .where(eq(doctors.hprId, hprId))
        .limit(1);

      // Determine the user and AyurSutra ID
      let userId: number;
      let doctorAyursutraId: string;
      let doctorName = "Doctor";

      if (existingDoctorProfile.length > 0) {
        const doctorProfile = existingDoctorProfile[0];
        doctorAyursutraId = doctorProfile.ayursutraId;
        doctorName = doctorProfile.name;

        // Check if there's already a user for this doctor identity
        const existingUserForDoctor = await db
          .select()
          .from(users)
          .where(eq(users.ayursutraId, doctorAyursutraId))
          .limit(1);

        if (existingUserForDoctor.length > 0) {
          // Case 1: Doctor user already exists - Update and Log in
          userId = existingUserForDoctor[0].id;
          await db
            .update(users)
            .set({
              email: isEmail ? identifier : existingUserForDoctor[0].email,
              phone: isEmail ? existingUserForDoctor[0].phone : identifier,
              emailVerified: isEmail ? new Date() : existingUserForDoctor[0].emailVerified,
              phoneVerified: isEmail ? existingUserForDoctor[0].phoneVerified : new Date(),
            })
            .where(eq(users.id, userId));

          return NextResponse.json({
            success: true,
            userId,
            role: "doctor",
            redirectUrl: "/dashboard/doctor",
            message: `Welcome back, ${doctorName}!`,
          });
        } else {
          // Case 2: Profile exists but no User account yet - Create user and link to profile
          const newUser = await db
            .insert(users)
            .values({
              email: isEmail ? identifier : null,
              phone: isEmail ? null : identifier,
              role: "doctor",
              ayursutraId: doctorAyursutraId, // Directly use the profile's ID
              emailVerified: isEmail ? new Date() : null,
              phoneVerified: isEmail ? null : new Date(),
            })
            .returning({ id: users.id });
          
          userId = newUser[0].id;
        }
      } else {
        // Case 3: No profile exists yet - Create new user and new profile
        const newUser = await db
          .insert(users)
          .values({
            email: isEmail ? identifier : null,
            phone: isEmail ? null : identifier,
            role: "doctor",
            emailVerified: isEmail ? new Date() : null,
            phoneVerified: isEmail ? null : new Date(),
          })
          .returning({ id: users.id });

        userId = newUser[0].id;

        const { generateAyurSutraId, assignAyurSutraId } = await import(
          "@/lib/ayursutra-id"
        );
        doctorAyursutraId = await generateAyurSutraId("doctor");
        await assignAyurSutraId(userId, "doctor");

        await db.insert(doctors).values({
          ayursutraId: doctorAyursutraId,
          name: "Doctor", 
          specialization: "General Practitioner",
          experience: "5",
          location: "India",
          hprId: hprId,
          abhaId: abhaId || null,
        });
      }

      return NextResponse.json({
        success: true,
        userId,
        role: "doctor",
        redirectUrl: "/dashboard/doctor",
        message: "Doctor account setup successfully!",
      });
    }

    // Create new patient user (default)
    const newUser = await db
      .insert(users)
      .values({
        email: isEmail ? identifier : null,
        phone: isEmail ? null : identifier,
        role: "patient",
        emailVerified: isEmail ? new Date() : null,
        phoneVerified: isEmail ? null : new Date(),
      })
      .returning({ id: users.id });

    return NextResponse.json({
      success: true,
      userId: newUser[0].id,
      role: "patient",
      redirectUrl: "/dashboard/patient",
      message: "Welcome to AyurSutra!",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
