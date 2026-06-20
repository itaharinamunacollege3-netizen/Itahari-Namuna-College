// prisma/seed.ts

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

  const programs = [
    {
      slug: "bhm",
      code: "BHM",
      title: "Bachelor of Hotel Management (BHM)",
      image:
        "https://namunacollege.edu.np/wp-content/uploads/2024/03/Screenshot-2024-03-12-at-8.36.13%E2%80%AFAM.png",
      duration: "4 Years (8 Semesters)",
      university: "Tribhuvan University (TU)",
      tagline: "Step into a vibrant, global career in luxury hospitality and culinary arts.",
      overview:
        "The Bachelor of Hotel Management (BHM) program is an intensive professional course blend of theoretical knowledge and practical hospitality training. It covers the fundamentals of food and beverage production, housekeeping operations, front office management, and global service standards.",
      objectives: [
        "Prepare students for supervisory and leadership roles within the global hotel and catering industry.",
        "Develop technical proficiency and social intelligence for professional service operations.",
        "Master financial cost control measures to ensure business profitability.",
        "Establish high-standard quality assurance protocols for customer service excellence.",
        "Foster an entrepreneurial mindset for managing small-to-medium hospitality enterprises.",
      ],
      careerPathways: [
        "Hotel Operations Manager",
        "Executive Chef or F&B Manager",
        "Event and Banquet Planner",
        "Tourism Consultant",
        "Entrepreneur in Hospitality",
      ],
      eligibility: [
        "Completed 10+2 or equivalent from a recognized board.",
        "Must have successfully passed the Centralized CMAT Entrance Exam conducted by Tribhuvan University.",
      ],
      highlights: ["F&B Management", "Hotel Operations", "Event Planning", "Tourism Economics"],
      curriculum: {
        "1": ["Food Production & Patisserie I", "Food & Beverage Service I"],
        "2": ["Food Production & Patisserie II", "Food & Beverage Service II"],
      },
      seats: 48,
      sortOrder: 1,
    },
    {
      slug: "bsw",
      code: "BSW",
      title: "Bachelor of Arts in Social Work (BASW/BSW)",
      image:
        "https://namunacollege.edu.np/wp-content/uploads/2024/05/61e21c87-c185-43c7-85d7-c219cc076bf7-1024x577.jpeg",
      duration: "4 Years (8 Semesters)",
      university: "Tribhuvan University (TU)",
      tagline: "Drive meaningful transformation and empower local communities.",
      overview:
        "The Bachelor of Social Work (BSW) provides a robust conceptual and field-based foundation for students aiming to drive meaningful societal change. It bridges the gap between classroom theory and real-world application, making it a cornerstone for those looking to work within Nepal's diverse social ecosystems.",
      objectives: [
        "Build qualified and dedicated human resources in the field of humanities and social science.",
        "Provide conceptual and field-based knowledge to address societal issues.",
        "Equip students with professional intervention skills for individual and community welfare.",
        "Promote social justice, human rights, and sustainable development practices.",
      ],
      careerPathways: [
        "Social Worker / Activist",
        "NGO/INGO Project Coordinator",
        "Community Development Consultant",
        "Human Rights Advocate",
        "Academic Researcher or Educator",
      ],
      eligibility: [
        "Passed Proficiency Certificate Level (PCL) or 10+2 in any stream from an accredited board.",
        "Compliance with TU grading criteria and performance in a screening interview.",
      ],
      highlights: ["Community Development", "Counselling Skills", "Policy & Advocacy", "NGO Field Placement"],
      curriculum: {
        "1": ["Concepts and Principles of Social Work", "Social Work Practice"],
        "2": ["Social Case Work and Group Work"],
      },
      seats: 36,
      sortOrder: 2,
    },
    {
      slug: "bca",
      code: "BCA",
      title: "Bachelor of Computer Application (BCA)",
      image:
        "https://namunacollege.edu.np/wp-content/uploads/2024/03/Screenshot-2024-03-12-at-8.35.23%E2%80%AFAM.png",
      duration: "4 Years (8 Semesters)",
      university: "Tribhuvan University (TU)",
      tagline: "Build professional competence in real-world application engineering.",
      overview:
        "The Bachelor of Computer Application (BCA) is a specialized four-year degree under Tribhuvan University designed for the next generation of IT professionals. The curriculum centers on practical application development, teaching students to build, maintain, and secure complex digital systems.",
      objectives: [
        "Develop strong programming proficiency in C, Java, Python, and web technologies.",
        "Build foundational knowledge in data structures, algorithms, and operating systems.",
        "Train in database design, network administration, and software engineering.",
        "Foster innovation through project-based learning and industry internships.",
      ],
      careerPathways: [
        "Software Developer / Engineer",
        "Web & Mobile App Developer",
        "Database Administrator",
        "IT Consultant & Systems Analyst",
        "Cybersecurity Analyst",
      ],
      eligibility: [
        "Completed 10+2 or equivalent with minimum qualifying thresholds set by TU.",
        "Must achieve a passing rank in the FOHSS Centralized BCA Entrance Examination.",
      ],
      highlights: ["AI & Machine Learning", "Full Stack Web Dev", "Cloud Computing", "Cyber Security"],
      curriculum: {
        "1": ["Computer Fundamentals & Applications"],
        "2": ["C Programming"],
      },
      seats: 60,
      sortOrder: 3,
    },
    {
      slug: "bbm",
      code: "BBM",
      title: "Bachelor of Business Management (BBM)",
      image: "/images/campus-1.webp",
      duration: "4 Years (8 Semesters)",
      university: "Tribhuvan University (TU)",
      tagline: "Strategic management, entrepreneurship, and finance for tomorrow's business leaders.",
      overview:
        "The Bachelor of Business Management (BBM) program develops analytical, leadership, and entrepreneurial skills for modern business environments. Students gain practical knowledge in finance, marketing, operations, and organizational behavior.",
      objectives: [
        "Develop managerial competence for corporate and entrepreneurial settings.",
        "Train students in financial analysis, marketing strategy, and business planning.",
        "Build communication and leadership skills for professional business roles.",
        "Promote ethical decision-making and sustainable business practices.",
      ],
      careerPathways: [
        "Business Manager",
        "Marketing Executive",
        "Financial Analyst",
        "Entrepreneur",
        "HR and Operations Specialist",
      ],
      eligibility: [
        "Completed 10+2 or equivalent from a recognized board.",
        "Must meet Tribhuvan University admission criteria for management programs.",
      ],
      highlights: ["Entrepreneurship", "Finance", "Marketing", "Leadership"],
      curriculum: {
        "1": ["Principles of Management", "Business Mathematics"],
        "2": ["Financial Accounting", "Business Communication"],
      },
      seats: 72,
      sortOrder: 4,
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        title: program.title,
        code: program.code,
        image: program.image,
        duration: program.duration,
        university: program.university,
        tagline: program.tagline,
        overview: program.overview,
        objectives: program.objectives,
        careerPathways: program.careerPathways,
        eligibility: program.eligibility,
        highlights: program.highlights,
        curriculum: program.curriculum,
        seats: program.seats,
        sortOrder: program.sortOrder,
        isFeatured: true,
        published: true,
      },
      create: {
        ...program,
        isFeatured: true,
        published: true,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
