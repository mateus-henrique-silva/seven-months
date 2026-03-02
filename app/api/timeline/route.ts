import { auth } from "@/auth";
import { db } from "@/lib/db";
import { timelineEvents } from "@/lib/schema";
import { asc, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await db
      .select()
      .from(timelineEvents)
      .orderBy(asc(timelineEvents.date));

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, title, description, emoji, imageUrl, isMonthly } = body;

    if (!date || !title) {
      return NextResponse.json({ error: "Date and title are required" }, { status: 400 });
    }

    const newEvent = await db
      .insert(timelineEvents)
      .values({ date, title, description, emoji, imageUrl, isMonthly })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("Error creating timeline event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(timelineEvents).where(eq(timelineEvents.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting timeline event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
