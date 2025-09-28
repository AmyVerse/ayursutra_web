import { generateOTP, sendOTPEmail, sendOTPSMS, storeOTP } from "@/lib/otp";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sendOTPSchema = z.object({
  identifier: z.string().min(1, "Phone or email is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier } = sendOTPSchema.parse(body);

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database
    const stored = await storeOTP(identifier, otp);
    if (!stored) {
      return NextResponse.json(
        { error: "Failed to store OTP" },
        { status: 500 }
      );
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes("@");
    let sent = false;

    if (isEmail) {
      sent = await sendOTPEmail(identifier, otp);
    } else {
      sent = await sendOTPSMS(identifier, otp);
    }

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${identifier}`,
    });
  } catch (error) {
    console.error("Send OTP error:", error);

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
