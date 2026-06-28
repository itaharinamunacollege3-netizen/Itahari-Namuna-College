export const JOURNAL_FIELDS = [
  "Social Sciences",
  "Economics",
  "Computer Science",
  "Urban Studies",
  "Education",
  "Environmental Science",
];

export const JOURNAL_ACCENT_COLORS = [
  { label: "Forest Green", value: "#045d30" },
  { label: "Sky Blue", value: "#3db2e1" },
  { label: "Gold", value: "#f2b843" },
  { label: "Crimson", value: "#c22368" },
  { label: "Orange", value: "#e17622" },
];

export const JOURNAL_FIELD_HINTS = {
  title: "Minimum 3 characters. Full paper title.",
  abstract: "Minimum 20 characters. Shown on list cards and detail page.",
  authors: "Comma-separated author names.",
  keywords: "Comma-separated research keywords.",
  sections: "At least one section with heading and body.",
  featured: "Only one entry is shown as Editor's Pick on the journal page.",
  isPopular: "Shown in the Most Cited sidebar.",
};

export const EMPTY_JOURNAL_SECTION = {
  heading: "",
  body: "",
  bullets: "",
};
