import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { username, email, password, age, gender, interests } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role (Assign admin to the owner's email)
    const role = email === "nandysakash3@gmail.com" ? "admin" : "user";

    // Create the user
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
      { message: "User created successfully", user: { id: newUser._id, email: newUser.email, role: newUser.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
