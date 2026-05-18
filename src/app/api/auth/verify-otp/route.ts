import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/db";
import OtpModel from "@/models/Otp";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { username, email, password, age, gender, interests, otp } = await req.json();

    if (!otp || !email) {
      return NextResponse.json({ message: "OTP and email are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Find OTP record
    const otpRecord = await OtpModel.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json({ message: "OTP expired or not found. Please request a new one." }, { status: 400 });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await OtpModel.deleteOne({ email });
      return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ message: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // OTP is valid — delete it
    await OtpModel.deleteOne({ email });

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email or username already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign admin role to owner
    const role = email === "nandysakash3@gmail.com" ? "admin" : "user";

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      age,
      gender,
      interests: interests || [],
      role,
    });

    return NextResponse.json(
      { message: "Account created successfully!", user: { id: newUser._id, email: newUser.email, role: newUser.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
