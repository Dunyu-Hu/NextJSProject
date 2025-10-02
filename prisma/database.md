# prisma

## Install Dependencies

```npm i @prisma/client bcryptjs```

dependencies(can be seen in package.json). 

Install Prisma Client (for runtime use) and a password hashing library.

It must be installed as a production dependency because the code will need it when deployed.

```npm i -D prisma```

devdependencies(can be seen in package.json).

This is a CLI tool, only used during development, for example:

```
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

It won’t be used at all in the production environment (when the server is running).

```npx prisma init --datasource-provider sqlite```

```npx prisma init``` creates ```prisma/schema.prisma``` (the database schema definition file) 

and ```.env``` (the environment variables file, with DATABASE_URL by default)

```--datasource-provider sqlite``` → Specifies the database type as SQLite.

## Table Structure

The structure of all database tables (fields and relationships) is defined in the ```prisma/schema.prisma``` file.

for example:

```
model User {
  id           Int    @id @default(autoincrement())
  username     String @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

After defining models such as User, run ```npx prisma migrate dev --name init``` to actually create the tables in the database and generate migration records.

If later you add other tables or modify the structure of existing ones, you need to run `npx prisma migrate dev --name xxx_table` again.

Tables can be seen at ```prisma/migrations```

```npx prisma studio```

Open the database visually.

## Initialize the Prisma Client (to avoid multiple instances during hot reload).

In ```src/lib```

```
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

Avoid creating multiple PrismaClient instances in the development environment.

In Next.js development mode (npm run dev), the app automatically hot reloads every time you save a file.

If we call new PrismaClient() each time, a new database connection will be created on every hot reload.

The result: the number of database connections can explode in a short time, even leading to errors like:

```Error: Already 10 Prisma Clients are actively running.```

The solution is to attach PrismaClient to the global object.

This code stores the PrismaClient instance in a global variable.

If one already exists, it reuses it.

If not, it creates a new one.

In the production environment (after deployment), there’s no hot reload, so it’s fine to just use new PrismaClient().

This issue doesn’t occur in the production environment, but writing a unified piece of code is safer.

Every time we access the database, you need to import it in the file with: ```import { db } from "@/lib/db"```

## Seed(optional)

```
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

```

When you first create the database, it’s empty.

A seed script can automatically insert a batch of initial data (for example, a default admin account abcd/1234, test users, basic configurations, etc.).

Benefits: when switching computers, rebuilding the database, or collaborating in a team, everyone only needs to run npm run seed once, and the database will automatically have the data—no need to manually add it through Prisma Studio.