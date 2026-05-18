import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectToDatabase();

  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  const totalUsers = users.length;
  const bannedUsers = users.filter((u) => u.isBanned).length;

  return NextResponse.json({ users, stats: { totalUsers, bannedUsers } });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { userId, action } = await req.json();
  await connectToDatabase();

  if (action === "ban") {
    await User.findByIdAndUpdate(userId, { isBanned: true });
    return NextResponse.json({ message: "User banned" });
  }

  if (action === "unban") {
    await User.findByIdAndUpdate(userId, { isBanned: false });
    return NextResponse.json({ message: "User unbanned" });
  }

  if (action === "delete") {
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: "User deleted" });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
