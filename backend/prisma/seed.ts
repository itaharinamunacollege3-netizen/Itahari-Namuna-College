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
    update: {
      name: adminName,
      passwordHash,
      role: "admin",
      isActive: true,
      mustChangePassword: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
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

  const blogPosts = [
    {
      slug: "experiential-learning-higher-education",
      title: "How Experiential Learning is Reshaping Higher Education",
      excerpt:
        "Classrooms are no longer the only place where learning happens. Discover how hands-on projects and industry partnerships are transforming what it means to study at Itahari Namuna College.",
      intro:
        "The traditional lecture hall is evolving. As industries demand more adaptable graduates, educational institutions across Nepal and the world are fundamentally rethinking how knowledge is delivered and absorbed.",
      category: "Education",
      author: "Dr. Ramesh Sharma",
      authorRole: "Head of Academic Affairs",
      readTime: "5 min read",
      accentColor: "#045d30",
      featured: true,
      isPopular: true,
      publishedAt: new Date("2025-06-15"),
      tags: ["Education", "Experiential Learning", "Career Readiness", "College Life"],
      sections: [
        {
          heading: "Why the Old Model is No Longer Enough",
          body: "For decades, higher education operated on a simple model: lecture, note-take, examine, repeat. It worked well in an era when information was scarce and expert transmission was the primary goal. Today, information is abundant — the challenge is no longer access, it is application.",
          bullets: [
            "Employers consistently cite inability to apply knowledge as a top graduate shortcoming.",
            "Critical thinking and problem-solving now rank above technical knowledge in most hiring rubrics.",
            "Industries evolve faster than curricula — real-world exposure closes that gap.",
          ],
        },
        {
          heading: "What Experiential Learning Actually Looks Like",
          body: "At Itahari Namuna College, experiential learning is embedded into how students spend their time. Projects are built for real clients. Fieldwork is graded alongside written reports.",
          bullets: [
            "Live project briefs issued by partner businesses each semester.",
            "Structured internship weeks woven into the academic calendar.",
            "Community outreach assignments in place of conventional research papers.",
          ],
        },
        {
          heading: "Looking Ahead",
          body: "Itahari Namuna College is deepening its industry partnerships and creating structured pathways for students to transition seamlessly from campus to career.",
        },
      ],
      callout: {
        heading: "Key Takeaway",
        body: "A degree is a credential. Experience is the evidence. The most competitive graduates carry both.",
      },
      sortOrder: 1,
    },
    {
      slug: "student-innovation-lab",
      title: "Student Innovation Lab: Where Ideas Become Reality",
      excerpt:
        "Our Innovation Lab has produced over 30 student-led projects this year alone. Here is a look at some of the most exciting ideas that emerged from our campus.",
      intro:
        "Our Innovation Lab has produced over 30 student-led projects this year alone. Here is a look at some of the most exciting ideas that emerged from our campus — and what drove the teams behind them.",
      category: "Innovation",
      author: "Priya Thapa",
      authorRole: "Innovation Lab Coordinator",
      readTime: "4 min read",
      accentColor: "#e17622",
      featured: false,
      isPopular: true,
      publishedAt: new Date("2025-05-28"),
      tags: ["Innovation", "Student Projects", "Entrepreneurship", "Lab"],
      sections: [
        {
          heading: "What the Lab Actually Does",
          body: "The Innovation Lab is a structured environment where student teams move through defined phases: problem identification, research, prototyping, testing, and presentation.",
          bullets: [
            "Teams of 3–5 students work across departments.",
            "Faculty mentors assigned per project domain.",
            "Monthly demo days open to industry partners.",
          ],
        },
        {
          heading: "How to Get Involved",
          body: "Applications for the next Innovation Lab cohort open at the start of each semester. Submit a one-page problem statement to the Lab Coordinator to be considered.",
        },
      ],
      callout: {
        heading: "Apply for the Next Cohort",
        body: "Applications for the upcoming semester open in August. All enrolled students are eligible.",
      },
      sortOrder: 2,
    },
    {
      slug: "career-fairs-first-year-guide",
      title: "A Guide to Navigating Career Fairs as a First-Year Student",
      excerpt:
        "Walking into a career fair can feel overwhelming. Our career counsellors share their top strategies for making meaningful connections.",
      intro:
        "Walking into a career fair can feel overwhelming. Our career counsellors share their top strategies for making meaningful connections and landing internship opportunities.",
      category: "Career",
      author: "Sita Karki",
      authorRole: "Career Counsellor",
      readTime: "6 min read",
      accentColor: "#c22368",
      featured: false,
      isPopular: true,
      publishedAt: new Date("2025-05-10"),
      tags: ["Career", "Internships", "Student Success"],
      sections: [
        {
          heading: "Prepare Before You Arrive",
          body: "Research participating organizations, refine your introduction, and bring copies of your updated CV.",
        },
      ],
      callout: null,
      sortOrder: 3,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        intro: post.intro,
        category: post.category,
        author: post.author,
        authorRole: post.authorRole,
        readTime: post.readTime,
        accentColor: post.accentColor,
        sections: post.sections,
        callout: post.callout,
        tags: post.tags,
        featured: post.featured,
        isPopular: post.isPopular,
        published: true,
        publishedAt: post.publishedAt,
        sortOrder: post.sortOrder,
      },
      create: {
        ...post,
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
