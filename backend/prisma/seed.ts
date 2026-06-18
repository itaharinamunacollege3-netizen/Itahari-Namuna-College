import "dotenv/config";
import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/hash";
import { slugify } from "../src/utils/slug";

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

  const notices = [
    {
      title: "Semester End Examination Routine — BCA/BBM/BHM/BSW 2080",
      content:
        "The Semester End Examination routine for all TU-affiliated programs for the academic year 2080/81 has been published.",
      summary: "Examination routine published for all programs.",
      category: "TU Exams",
      tags: ["IMPORTANT", "TU Exams"],
      audience: "All Programs",
      author: "Examination Controller",
      publishedAt: new Date("2024-06-10"),
    },
    {
      title: "Scholarship Application Open — Merit & Need-Based 2081/82",
      content: "Applications for scholarships are now open for the 2081/82 session.",
      summary: "Scholarship applications open.",
      category: "Admissions",
      tags: ["IMPORTANT", "Admissions"],
      audience: "All Programs",
      author: "Admin Office",
      publishedAt: new Date("2024-06-05"),
      showInMarquee: true,
      marqueeText: "Scholarship Applications Open — Merit & Need-Based 2083",
    },
  ];

  for (const n of notices) {
    const slug = slugify(n.title);
    await prisma.notice.upsert({
      where: { slug },
      update: {},
      create: {
        ...n,
        slug,
        showInPopup: false,
        showInMarquee: n.showInMarquee ?? false,
        marqueeText: n.marqueeText ?? null,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
