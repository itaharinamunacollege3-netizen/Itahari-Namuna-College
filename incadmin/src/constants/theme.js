export const BRAND = {
  primary: "#045d30",
  blue: "#3db2e1",
  gold: "#f2b843",
  crimson: "#c22368",
  orange: "#e17622",
  dark: "#20242b",
  gray: "#e7eaef",
  white: "#fffeff",
};

export const STATUS_LABELS = {
  pending: "Pending",
  under_review: "Review",
  approved: "Approved",
  rejected: "Rejected",
};

export const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  under_review: "bg-sky-100 text-sky-800 border-sky-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-100 text-rose-800 border-rose-200",
};

export const ADMISSION_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "under_review", label: "Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];
