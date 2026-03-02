import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "libsql://seven-months-mateus-henrique-silva.aws-us-east-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN ?? "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4MDM5OTk5NTMsImlhdCI6MTc3MjQ2Mzk1MywiaWQiOiIwMTljYWYxNS0yNTAxLTc5NzAtODE1NC1jNDE0MTlkZmViNDAiLCJyaWQiOiI2ZDczYzQ3Yi0xMmQ5LTQ4YmItOGYwNy04ZDYzM2NjMDFkMDUifQ.7JSXrBuXBebQdhNMEOTbK2NgeWVtqJuISrTt6DvUxrIGZbedwrsYuL2ZwQ8vR4geDrd5ovDpv715PJCydz2cAQ",
});

export const db = drizzle(client, { schema });
