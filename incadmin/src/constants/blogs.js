export const BLOG_CATEGORIES = [
  "Education",
  "Innovation",
  "Career",
  "Wellness",
  "Campus Life",
  "Sustainability",
];

export const BLOG_ACCENT_COLORS = [
  { label: "Forest Green", value: "#045d30" },
  { label: "Sky Blue", value: "#3db2e1" },
  { label: "Gold", value: "#f2b843" },
  { label: "Crimson", value: "#c22368" },
  { label: "Orange", value: "#e17622" },
];

export const BLOG_FIELD_HINTS = {
  title: "Minimum 3 characters. Used for page heading and SEO.",
  excerpt: "Short summary shown on blog cards (min 10 characters).",
  intro: "Lead paragraph shown at the top of the article.",
  sections: "At least one section with heading and body. Bullets are optional.",
  tags: "Comma-separated tags for filtering and display.",
  slug: "URL-friendly identifier. Auto-generated from title if left blank.",
  featured: "Only one featured post is shown in the blog hero section.",
  isPopular: "Shown in the Most Popular sidebar on the public blog page.",
};

export const EMPTY_BLOG_SECTION = {
  heading: "",
  body: "",
  bullets: "",
};
