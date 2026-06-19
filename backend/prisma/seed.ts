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

  const notices = [
    {
      title: "Semester End Examination Routine — BCA/BBM/BHM/BSW 2080",
      content:
        "The Semester End Examination routine for all TU-affiliated programs for the academic year 2080/81 has been published. Students are advised to download the routine and prepare accordingly. Examination halls will be allotted one week prior to the commencement date.",
      category: "TU Exams",
      tags: ["IMPORTANT", "TU Exams"],
      audience: "All Programs",
      author: "Examination Controller",
      publishedDate: "2081-03-10",
      publishedAt: new Date("2024-06-10"),
      featured: false,
    },
    {
      title: "Scholarship Application Open — Merit & Need-Based 2081/82",
      content:
        "Applications for the 2081/82 academic session scholarships are now open. Interested candidates must submit their documents to the administration office by the end of the month.",
      category: "Admissions",
      tags: ["IMPORTANT", "Admissions"],
      audience: "All Programs",
      author: "Admin Office",
      publishedDate: "2081-03-05",
      publishedAt: new Date("2024-06-05"),
      featured: true,
      showInPopup: true,
    },
    {
      title: "Public Holiday Notice — Eid-ul-Adha & International Yoga Day",
      content:
        "The college will remain closed on the occasion of Eid-ul-Adha and International Yoga Day. Regular classes will resume the following day.",
      category: "Holidays",
      tags: ["Holidays"],
      audience: "All Programs",
      author: "College Management",
      publishedDate: "2081-02-28",
      publishedAt: new Date("2024-05-28"),
      featured: false,
    },
  ];

  for (const n of notices) {
    const slug = slugify(n.title);
    await prisma.notice.upsert({
      where: { slug },
      update: {
        content: n.content,
        publishedDate: n.publishedDate,
        featured: n.featured,
        showInPopup: n.showInPopup ?? n.featured,
        tags: n.tags,
      },
      create: {
        ...n,
        slug,
        showInMarquee: false,
        marqueeText: null,
        attachmentUrl: null,
      },
    });
  }

  const galleryAlbums = [
    {
      slug: "bca",
      title: "BCA Department",
      description: "Computing, Coding, and Technical Innovation",
      coverImage:
        "https://namunacollege.edu.np/wp-content/uploads/2024/03/Screenshot-2024-03-12-at-8.35.23%E2%80%AFAM.png",
      imageUrls: ["/images/gallery/bca-1.jpg", "/images/gallery/bca-2.jpg"],
      sortOrder: 1,
    },
    {
      slug: "bhm",
      title: "BHM Department",
      description: "Culinary Arts, Hospitality & Management",
      coverImage:
        "https://namunacollege.edu.np/wp-content/uploads/2024/03/Screenshot-2024-03-12-at-8.36.13%E2%80%AFAM.png",
      imageUrls: ["/images/gallery/bhm-1.jpg", "/images/gallery/bhm-2.jpg"],
      sortOrder: 2,
      isFeatured: true,
    },
    {
      slug: "bsw",
      title: "BSW Department",
      description: "Fieldwork, Social Impact & Community Services",
      coverImage:
        "https://namunacollege.edu.np/wp-content/uploads/2024/05/61e21c87-c185-43c7-85d7-c219cc076bf7-1024x577.jpeg",
      imageUrls: ["/images/gallery/bsw-1.jpg", "/images/gallery/bsw-2.jpg"],
      sortOrder: 3,
    },
  ];

  for (const album of galleryAlbums) {
    const saved = await prisma.galleryAlbum.upsert({
      where: { slug: album.slug },
      update: {
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        isFeatured: album.isFeatured ?? false,
        sortOrder: album.sortOrder,
      },
      create: {
        slug: album.slug,
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        isFeatured: album.isFeatured ?? false,
        sortOrder: album.sortOrder,
        published: true,
      },
    });

    const imageCount = await prisma.galleryImage.count({ where: { albumId: saved.id } });
    if (imageCount === 0) {
      await prisma.galleryImage.createMany({
        data: album.imageUrls.map((url, index) => ({
          albumId: saved.id,
          imageUrl: url,
          sortOrder: index,
        })),
      });
    }
  }

  console.log("Seed complete.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
