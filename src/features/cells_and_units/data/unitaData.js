import heroCampus from "../../../assets/others/hero-campus.webp";

export const unitsData = {
  cmc: {
    title: "College Management Committee",
    objectives: ["Promote holistic development", "Design market-driven courses"],
    duties: ["Execute programs", "Manage extension activities"],
    actionPlan: [{ sn: 1, activity: "Design courses", byWhen: "Ongoing", byWho: "Directors", budget: "N/A" }],
    icon: heroCampus
  },
  iqac: {
    title: "Internal Quality Assurance Cell",
    objectives: ["Enhance educational processes", "Establish quality benchmarks"],
    duties: ["Feedback mechanisms", "Annual audits"],
    actionPlan: [{ sn: 1, activity: "Review metrics", byWhen: "Monthly", byWho: "IQAC Team", budget: "N/A" }],
    icon: "/images/bird.webp"
  },
  sat: {
    title: "Self-Assessment Team",
    objectives: ["QAA Certification", "Compile SSR Annex"],
    duties: ["Collect institutional data", "Lead QAA process"],
    actionPlan: [{ sn: 1, activity: "Collect strategic plan", byWhen: "Jestha 2078", byWho: "Coordinator", budget: "N/A" }],
    icon: heroCampus
  },
  rmc: {
    title: "Research Management Committee",
    objectives: ["Promote high-quality research", "Secure research grants"],
    duties: ["Establish research policy", "Facilitate workshops"],
    actionPlan: [{ sn: 1, activity: "Approve policy framework", byWhen: "Jestha 2078", byWho: "Coordinator", budget: "N/A" }],
    icon: heroCampus
  },
  emis: {
    title: "Education Management Information System",
    objectives: ["Data-driven decision making", "Ensure data accuracy"],
    duties: ["Analyze educational data", "Maintain data repository"],
    actionPlan: [{ sn: 1, activity: "Approve data framework", byWhen: "Jestha 2078", byWho: "Coordinator", budget: "N/A" }],
    icon: heroCampus
  },
  fpsmc: {
    title: "Financial Planning & Strategic Management",
    objectives: ["Financial stability", "Strategic resource allocation"],
    duties: ["Budget preparation", "Financial monitoring"],
    actionPlan: [{ sn: 1, activity: "Develop financial policies", byWhen: "Jestha 2078", byWho: "Coordinator", budget: "N/A" }],
        icon: heroCampus
  },
  // Placeholders for remaining 7 to keep workflow focused
  sqc: { title: "Student Quality Circle", objectives: ["Student-faculty feedback"], duties: ["Quality audits"], actionPlan: [], icon:heroCampus},
  eceasc: { title: "Extra-Curricular & Extension", objectives: ["Holistic growth"], duties: ["Organize social events"], actionPlan: [], icon:heroCampus},
  scpsc: { title: "Sports & Cultural Program", objectives: ["Promote physical fitness"], duties: ["Organize sports week"], actionPlan: [], icon:heroCampus},
  lmsc: { title: "Library Management", objectives: ["Resource modernization"], duties: ["Book procurement"], actionPlan: [], icon:heroCampus},
  srwsc: { title: "Student Rights & Welfare", objectives: ["Address grievances"], duties: ["Counseling"], actionPlan: [], icon:heroCampus},
  idmsc: { title: "Infrastructure Development", objectives: ["Facility sustainability"], duties: ["Repair planning"], actionPlan: [], icon:heroCampus},
  saessc: { title: "Student Admission & Examination", objectives: ["Transparent admission"], duties: ["Exam coordination"], actionPlan: [], icon:heroCampus}
};