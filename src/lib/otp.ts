import { and, eq, gt, lt } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { db } from "./db";
import { otpVerifications } from "./db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create OTP JWT token for additional security
export function createOTPToken(identifier: string, otp: string): string {
  return jwt.sign({ identifier, otp }, process.env.JWT_SECRET!, {
    expiresIn: "10m",
  });
}

// Verify OTP JWT token
export function verifyOTPToken(
  token: string
): { identifier: string; otp: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      identifier: string;
      otp: string;
    };
  } catch {
    return null;
  }
}

// Send OTP via email
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: "AyurSutra <noreply@ayursutra.amyverse.in>",
      to: email,
      subject: "Your AyurSutra Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #109783; text-align: center;">AyurSutra</h2>
          <h3>Your Login OTP</h3>
          <p>Use this OTP to complete your login:</p>
          <div style="background: #f0f9ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #109783; font-size: 32px; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return false;
  }
}

// Send OTP via SMS (placeholder - you can integrate with SMS service)
export async function sendOTPSMS(phone: string, otp: string): Promise<boolean> {
  try {
    // For now, we'll use email as fallback since SMS requires additional setup
    // You can integrate with services like Twilio, AWS SNS, etc.
    console.log(`SMS OTP for ${phone}: ${otp}`);
    return true;
  } catch (error) {
    console.error("Failed to send OTP SMS:", error);
    return false;
  }
}

// Store OTP in database
export async function storeOTP(
  identifier: string,
  otp: string
): Promise<boolean> {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this identifier
    await db
      .delete(otpVerifications)
      .where(eq(otpVerifications.identifier, identifier));

    // Insert new OTP
    await db.insert(otpVerifications).values({
      identifier,
      otp,
      expiresAt,
    });

    return true;
  } catch (error) {
    console.error("Failed to store OTP:", error);
    return false;
  }
}

// Verify OTP from database
export async function verifyOTP(
  identifier: string,
  otp: string
): Promise<boolean> {
  try {
    const record = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.identifier, identifier),
          eq(otpVerifications.otp, otp),
          gt(otpVerifications.expiresAt, new Date()),
          eq(otpVerifications.verified, false)
        )
      )
      .limit(1);

    if (record.length === 0) {
      return false;
    }

    // Mark as verified
    await db
      .update(otpVerifications)
      .set({ verified: true })
      .where(eq(otpVerifications.id, record[0].id));

    return true;
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return false;
  }
}

// Clean up expired OTPs (call this periodically)
export async function cleanupExpiredOTPs(): Promise<void> {
  try {
    await db
      .delete(otpVerifications)
      .where(lt(otpVerifications.expiresAt, new Date()));
  } catch (error) {
    console.error("Failed to cleanup expired OTPs:", error);
  }
}
