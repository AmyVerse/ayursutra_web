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

    // User doesn't exist - create new user
    if (isDoctor && (hprId || abhaId)) {
      // Doctor signup with HPR/ABHA ID
      const doctorUser = await db
        .insert(users)
        .values({
          email: isEmail ? identifier : null,
          phone: isEmail ? null : identifier,
          role: "doctor",
          emailVerified: isEmail ? new Date() : null,
          phoneVerified: isEmail ? null : new Date(),
        })
        .returning({ id: users.id });

      const userId = doctorUser[0].id;

      // Create doctor record
      await db.insert(doctors).values({
        userId,
        hprId: hprId || null,
        abhaId: abhaId || null,
        specialization: "General Practitioner",
        experience: "5 years",
        location: "India",
      });

      return NextResponse.json({
        success: true,
        userId,
        role: "doctor",
        redirectUrl: "/dashboard/doctor",
        message: "Doctor account created successfully!",
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
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
