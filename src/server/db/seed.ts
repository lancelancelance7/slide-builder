import { eq } from "drizzle-orm";

import { closeDbConnection, db } from "~/server/db";
import { brandKits } from "~/server/db/schema";

const IRON_DEN_NAME = "Iron Den Fitness";

async function seed() {
  const existing = await db.query.brandKits.findFirst({
    where: eq(brandKits.name, IRON_DEN_NAME),
  });
  if (existing) {
    console.log(`${IRON_DEN_NAME} brand kit already exists; skipping seed.`);
    return;
  }

  await db.insert(brandKits).values({
    name: IRON_DEN_NAME,
    logoUrl: null,
    colors: {
      bg: "#0c0c0d",
      fg: "#ffffff",
      accent: "#ff4500",
      highlight: "#ffb38a",
    },
    fontDisplay:
      '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontText: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    tone: "direct",
    imageStyle:
      "Bold athletic photography, dramatic lighting, high contrast, premium gym aesthetic",
    isDefault: true,
  });

  console.log(`Inserted ${IRON_DEN_NAME} brand kit.`);
}

seed()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closeDbConnection());
