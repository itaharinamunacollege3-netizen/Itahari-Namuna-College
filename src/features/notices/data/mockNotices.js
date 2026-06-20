import noticePoster from '../../../assets/others/hero-campus.webp';

export const mockNotices = [
  {
    id: 1,
    title: "Semester End Examination Routine — BCA/BBM/BHM/BSW 2080",
    description: "The Semester End Examination routine for all TU-affiliated programs for the academic year 2080/81 has been published. Students are advised to download the routine and prepare accordingly. Examination halls will be allotted one week prior to the commencement date.",
    date: { day: "10", month: "JUN" },
    publishedDate: "2081-03-10",
    author: "Examination Controller",
    audience: "All Programs",
    tags: ["IMPORTANT", "TU Exams"],
    pdfUrl: "#",
    image: noticePoster,
    featured: false
  },
  {
    id: 2,
    title: "Scholarship Application Open — Merit & Need-Based 2081/82",
    description: "Applications for the 2081/82 academic session scholarships are now open. Interested candidates must submit their documents to the administration office by the end of the month.",
    date: { day: "05", month: "JUN" },
    publishedDate: "2081-03-05",
    author: "Admin Office",
    audience: "All Programs",
    tags: ["IMPORTANT", "Admissions"],
    pdfUrl: "#",
    image: noticePoster,
    featured: true
  },
  {
    id: 3,
    title: "Public Holiday Notice — Eid-ul-Adha & International Yoga Day",
    description: "The college will remain closed on the occasion of Eid-ul-Adha and International Yoga Day. Regular classes will resume the following day.",
    date: { day: "28", month: "MAY" },
    publishedDate: "2081-02-28",
    author: "College Management",
    audience: "All Programs",
    tags: ["Holidays"],
    pdfUrl: "#",
    image: noticePoster,
    featured: false
  }
];