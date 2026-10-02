import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2]?.trim().toLowerCase();

async function main(): Promise<void> {
  if (!email) throw new Error("Usage: node scripts/configure-admin.ts <existing-account-email>");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`Existing account not found: ${email}`);
  const admin = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN", status: "APPROVED" },
    select: { id: true, email: true, role: true, status: true },
  });
  console.log(admin);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Admin configuration failed.");
  process.exitCode = 1;
}).finally(async () => { await prisma.$disconnect(); });
