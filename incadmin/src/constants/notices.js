/** Matches backend notices.schema.ts + seed data categories */
export const NOTICE_CATEGORIES = [
  "TU Exams",
  "Admissions",
  "Holidays",
  "General",
  "Events",
  "Academic",
];

export const NOTICE_AUDIENCES = [
  "All Programs",
  "Students",
  "Staff",
  "Faculty",
  "Public",
];

export const NOTICE_FIELD_HINTS = {
  title: "Minimum 3 characters",
  description: "Notice body (HTML allowed — sanitized on save)",
  publishedDate: "Format: YYYY-MM-DD (e.g. 2081-03-10)",
  category: "Required — used for filtering on the public site",
  tags: "Comma-separated tags (each tag at least 1 character)",
  slug: "Optional — auto-generated from title if empty",
  pdfUrl: "Optional external PDF URL (must be valid http/https)",
  featured: "Only one notice can be featured at a time (shows in popup)",
  published: "Draft notices are hidden from the public website",
};
