const blogPosts = [
  {
    id: 1,
    slug: "experiential-learning-higher-education",
    title: "How Experiential Learning is Reshaping Higher Education",
    excerpt:
      "Classrooms are no longer the only place where learning happens. Discover how hands-on projects and industry partnerships are transforming what it means to study at Itahari Namuna College.",
    category: "Education",
    author: "Dr. Ramesh Sharma",
    date: "June 15, 2025",
    readTime: "5 min read",
    coverImage: "",
    featured: true,
    isPopular: true,
    tags: ["Education", "Experiential Learning", "Career Readiness", "College Life"],
    detail: {
      authorRole: "Head of Academic Affairs",
      intro:
        "The traditional lecture hall is evolving. As industries demand more adaptable graduates, educational institutions across Nepal and the world are fundamentally rethinking how knowledge is delivered and absorbed.",
      sections: [
        {
          heading: "Why the Old Model is No Longer Enough",
          body: "For decades, higher education operated on a simple model: lecture, note-take, examine, repeat.",
          bullets: [
            "Employers consistently cite inability to apply knowledge as a top graduate shortcoming.",
            "Critical thinking and problem-solving now rank above technical knowledge in most hiring rubrics.",
          ],
        },
        {
          heading: "Looking Ahead",
          body: "Itahari Namuna College is deepening its industry partnerships and creating structured pathways for students to transition seamlessly from campus to career.",
        },
      ],
      callout: {
        heading: "Key Takeaway",
        body: "A degree is a credential. Experience is the evidence.",
      },
    },
  },
  {
    id: 2,
    slug: "student-innovation-lab",
    title: "Student Innovation Lab: Where Ideas Become Reality",
    excerpt:
      "Our Innovation Lab has produced over 30 student-led projects this year alone.",
    category: "Innovation",
    author: "Priya Thapa",
    date: "May 28, 2025",
    readTime: "4 min read",
    coverImage: "",
    featured: false,
    isPopular: true,
    tags: ["Innovation", "Student Projects"],
    detail: {
      authorRole: "Innovation Lab Coordinator",
      intro: "Our Innovation Lab has produced over 30 student-led projects this year alone.",
      sections: [
        {
          heading: "What the Lab Actually Does",
          body: "The Innovation Lab is a structured environment where student teams move through defined phases.",
        },
      ],
      callout: null,
    },
  },
  {
    id: 3,
    slug: "career-fairs-first-year-guide",
    title: "A Guide to Navigating Career Fairs as a First-Year Student",
    excerpt: "Walking into a career fair can feel overwhelming.",
    category: "Career",
    author: "Sita Karki",
    date: "May 10, 2025",
    readTime: "6 min read",
    coverImage: "",
    featured: false,
    isPopular: true,
    tags: ["Career"],
    detail: {
      authorRole: "Career Counsellor",
      intro: "Walking into a career fair can feel overwhelming.",
      sections: [{ heading: "Prepare Before You Arrive", body: "Research participating organizations." }],
      callout: null,
    },
  },
];

export const mockBlogPosts = blogPosts;

export const mockPopularPosts = [
  blogPosts[0],
  blogPosts[2],
  blogPosts[1],
];

export const categoryColors = {
  Education: { bg: "bg-brand-primary/10", text: "text-brand-primary" },
  Innovation: { bg: "bg-brand-gold/15", text: "text-brand-orange" },
  Career: { bg: "bg-brand-crimson/10", text: "text-brand-crimson" },
  Wellness: { bg: "bg-brand-blue/10", text: "text-brand-blue" },
  "Campus Life": { bg: "bg-brand-orange/10", text: "text-brand-orange" },
  Sustainability: { bg: "bg-brand-primary/10", text: "text-brand-primary" },
};
