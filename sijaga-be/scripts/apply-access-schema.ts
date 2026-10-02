import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const columns = await prisma.$queryRaw<Array<{ column_name: string; table_name: string }>>`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND
      ((table_name = 'users' AND column_name = 'role') OR
       (table_name = 'usage_history' AND column_name = 'user_id'))
  `;
  if (columns.length === 0) {
    const sql = await readFile(new URL("../prisma/migrations/20261002090000_user_roles_and_history_owner/migration.sql", import.meta.url), "utf8");
    await prisma.$transaction(async (transaction) => {
      for (const statement of sql.split(";").filter((part) => part.trim())) {
        await transaction.$executeRawUnsafe(statement);
      }
    }, { timeout: 30000 });
  } else if (columns.length !== 2) {
    throw new Error("Partially applied access schema: inspect database before proceeding.");
  }
  const result = await prisma.user.groupBy({ by: ["role"], _count: true });
  await prisma.usageHistory.findFirst({ select: { id: true, userId: true } });
  console.log("Access schema verified.", result);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Schema deployment failed.");
  process.exitCode = 1;
}).finally(async () => { await prisma.$disconnect(); });
