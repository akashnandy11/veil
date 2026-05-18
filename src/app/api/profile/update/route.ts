import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { username, age, interests } = await req.json();
  await connectToDatabase();

  const updateData: any = {};
  if (username) updateData.username = username;
  if (age) updateData.age = parseInt(age);
  if (interests) {
    updateData.interests = interests.split(",").map((i: string) => i.trim()).filter(Boolean);
  }

  updateData.lastActive = new Date();

  await User.findOneAndUpdate(
    { email: (session.user as any).email },
    { $set: updateData }
  );

  return NextResponse.json({ message: "Profile updated successfully" });
}
