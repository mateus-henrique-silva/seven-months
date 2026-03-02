import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import * as schema from "../lib/schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:./local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function main() {
  console.log("🌸 Inicializando banco de dados...");

  // Create tables
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS timeline_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      emoji TEXT DEFAULT '💕',
      image_url TEXT,
      is_monthly INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_email TEXT NOT NULL,
      from_name TEXT NOT NULL,
      to_email TEXT NOT NULL,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      scheduled_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS disney_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'nota',
      image_url TEXT,
      is_completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      caption TEXT,
      date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Tabelas criadas!");

  // Seed timeline
  const existingEvents = await db.select().from(schema.timelineEvents);
  if (existingEvents.length === 0) {
    await db.insert(schema.timelineEvents).values([
      {
        date: "2025-02-12",
        title: "Nos encontramos na academia",
        description: "O primeiro encontro, o começo de tudo. Foi ali que eu te vi pela primeira vez e fui apresentado à mulher mais linda que já vi. Não sabia que aquele dia mudaria minha vida para sempre.",
        emoji: "💕",
        isMonthly: false,
      },
      {
        date: "2025-02-15",
        title: "Nossa primeira saída e nosso primeiro beijo",
        description: "No sábado depois que nos conhecemos, saímos juntos pela primeira vez. Foi mágico. Nosso primeiro beijo aconteceu naquele dia e eu soube que havia algo muito especial entre nós.",
        emoji: "💋",
        isMonthly: false,
      },
      {
        date: "2025-04-01",
        title: "Reencontro",
        description: "Tivemos idas e vindas, mas os sentimentos nunca foram embora. Em abril voltamos a nos encontrar e os laços foram se fortalecendo novamente.",
        emoji: "💞",
        isMonthly: false,
      },
      {
        date: "2025-07-01",
        title: "Um novo começo, com mais calma",
        description: "Na primeira semana de julho voltamos a nos falar. Dessa vez, com mais maturidade e calma, decidimos tentar de verdade. E foi a melhor decisão que já tomei.",
        emoji: "🌸",
        isMonthly: false,
      },
      {
        date: "2025-08-05",
        title: "Começamos a namorar! ❤️",
        description: "O dia em que nos tornamos oficialmente um casal. O dia em que percebi que estava com a pessoa certa. O começo da nossa história oficial.",
        emoji: "❤️",
        isMonthly: false,
      },
      {
        date: "2025-09-05",
        title: "1 mês juntos",
        description: "Um mês de muitas risadas, carinho e amor.",
        emoji: "🥂",
        isMonthly: true,
      },
      {
        date: "2025-10-05",
        title: "2 meses juntos",
        description: "Dois meses que passaram voando, mas cada momento ficou guardado no coração.",
        emoji: "💖",
        isMonthly: true,
      },
      {
        date: "2025-11-05",
        title: "3 meses juntos",
        description: "Três meses de parceria, amor e cumplicidade.",
        emoji: "🌹",
        isMonthly: true,
      },
      {
        date: "2025-12-05",
        title: "4 meses juntos",
        description: "Quatro meses, e ainda me pergunto como fui tão sortudo.",
        emoji: "✨",
        isMonthly: true,
      },
      {
        date: "2026-01-05",
        title: "5 meses juntos",
        description: "Começando o ano novo ao seu lado é tudo que eu poderia querer.",
        emoji: "🎆",
        isMonthly: true,
      },
      {
        date: "2026-02-05",
        title: "6 meses juntos",
        description: "Meio ano de amor, cumplicidade e parceria. Mal posso esperar pelos próximos.",
        emoji: "💝",
        isMonthly: true,
      },
      {
        date: "2026-03-05",
        title: "7 meses juntos 🎉",
        description: "Sete meses sendo o homem mais sortudo do mundo. Sete meses ao lado da mulher mais incrível que já conheci.",
        emoji: "🌷",
        isMonthly: true,
      },
    ]);
    console.log("✅ Timeline inserida!");
  }

  // Seed gallery
  const existingGallery = await db.select().from(schema.gallery);
  if (existingGallery.length === 0) {
    await db.insert(schema.gallery).values([
      { imageUrl: "/gallery/photo1.jpg", caption: "Nosso primeiro registro", date: "2025-02-12" },
      { imageUrl: "/gallery/photo2.jpg", caption: "Momentos juntos", date: "2025-03-01" },
      { imageUrl: "/gallery/photo3.jpg", caption: "Nós dois", date: "2025-04-01" },
      { imageUrl: "/gallery/photo4.jpg", caption: "Amor em cada detalhe", date: "2025-06-01" },
      { imageUrl: "/gallery/photo5.jpg", caption: "Nossa história", date: "2025-08-05" },
      { imageUrl: "/gallery/photo6.jpg", caption: "Sete meses de alegria", date: "2026-03-05" },
    ]);
    console.log("✅ Galeria inserida!");
  }

  console.log("🎉 Banco de dados inicializado com sucesso!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
