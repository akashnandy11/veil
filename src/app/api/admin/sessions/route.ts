import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import ChatSession from "@/models/ChatSession";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin access
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch the 50 most recent chat sessions, sorted by startedAt descending
    const sessions = await ChatSession.find()
      .sort({ startedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error("Admin sessions fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
