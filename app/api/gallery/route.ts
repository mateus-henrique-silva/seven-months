import { auth } from "@/auth";
import { db } from "@/lib/db";
import { gallery } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const photos = await db
      .select()
      .from(gallery)
      .orderBy(asc(gallery.date));

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Internal server error", detail: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { imageUrl, caption, date } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const newPhoto = await db
      .insert(gallery)
      .values({ imageUrl, caption, date })
      .returning();

    return NextResponse.json(newPhoto[0], { status: 201 });
  } catch (error) {
    console.error("Error adding gallery photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
