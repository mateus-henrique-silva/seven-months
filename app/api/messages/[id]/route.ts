import { auth } from "@/auth";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
