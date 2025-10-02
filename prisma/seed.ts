import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
    const username = "abc";
    const passwordHash = await bcrypt.hash("123", 10);

    await db.user.upsert({
        where: { username },
        update: {},
        create: { username, passwordHash },
    });

    console.log("Seeded user: abc / 123");
}

main().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
});
