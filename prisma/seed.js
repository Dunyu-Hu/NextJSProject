/* eslint-disable @typescript-eslint/no-require-imports */
// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
    const username = "abcd";
    const passwordHash = await bcrypt.hash("1234", 10);

    await db.user.upsert({
        where: { username },
        update: {},
        create: { username, passwordHash },
    });

    console.log("✅ Seeded user: abcd / 1234");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
