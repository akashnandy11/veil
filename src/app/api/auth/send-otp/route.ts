import { NextResponse } from "next/server";
import { Resend } from "resend";
import connectToDatabase from "@/lib/db";
import OtpModel from "@/models/Otp";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Delete any existing OTP for this email
    await OtpModel.deleteMany({ email });

    const otp = generateOtp();

    // Save new OTP to DB
    await OtpModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "Veil <onboarding@resend.dev>",
      to: email,
      subject: "Your Veil Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a12; color: white; border-radius: 16px; padding: 32px; border: 1px solid rgba(168,85,247,0.2);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #a855f7, #ec4899); border-radius: 12px; padding: 12px 20px; margin-bottom: 16px;">
              <span style="font-size: 24px; font-weight: 900; color: white;">VEIL</span>
            </div>
            <h1 style="font-size: 20px; font-weight: 700; margin: 0; color: white;">Email Verification</h1>
          </div>
          
          <p style="color: #94a3b8; font-size: 15px; text-align: center; margin-bottom: 24px;">
            Enter this code to verify your DCE email address. It expires in <strong style="color: white;">10 minutes</strong>.
          </p>
          
          <div style="background: rgba(168,85,247,0.1); border: 2px solid rgba(168,85,247,0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #a855f7;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 13px; text-align: center;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
