// prisma/seed.ts

import "dotenv/config";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/hash";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@namunacollege.edu.np";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe@123456";
  const adminName = process.env.SEED_ADMIN_NAME ?? "System Admin";

  const passwordHash = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: "admin",
      mustChangePassword: true,
    },
  });

  console.log("Seed complete.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
