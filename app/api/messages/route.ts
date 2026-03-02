import { auth } from "@/auth";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { Resend } from "resend";
import { asc, desc, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const USERS: Record<string, string> = {
  "magtash68@gmail.com": "Mateus",
  "bellachamon@gmail.com": "Isabella",
};

function getPartnerEmail(email: string): string {
  return email === "magtash68@gmail.com"
    ? "bellachamon@gmail.com"
    : "magtash68@gmail.com";
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userMessages = await db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.fromEmail, session.user.email),
          eq(messages.toEmail, session.user.email)
        )
      )
      .orderBy(desc(messages.createdAt));

    return NextResponse.json(userMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, scheduledDate } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const fromEmail = session.user.email;
    const fromName = USERS[fromEmail] || session.user.name || "Alguém";
    const toEmail = getPartnerEmail(fromEmail);

    const newMessage = await db
      .insert(messages)
      .values({
        fromEmail,
        fromName,
        toEmail,
        content,
        scheduledDate: scheduledDate || null,
      })
      .returning();

    // Send email notification
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_sua_chave_aqui") {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "noreply@resend.dev",
          to: [toEmail],
          subject: `💌 ${fromName} te enviou uma mensagem especial!`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FFF0F5; padding: 40px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #E5637C; font-size: 28px; margin: 0;">💌 Mensagem especial</h1>
                <p style="color: #7A3E4F; margin: 10px 0 0;">de ${fromName} para você</p>
              </div>
              <div style="background: white; border-radius: 12px; padding: 30px; border-left: 4px solid #FFB3C6;">
                <p style="color: #3D1A24; font-size: 18px; line-height: 1.8; margin: 0;">${content}</p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #7A3E4F; font-size: 14px;">Com amor ❤️</p>
              </div>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
