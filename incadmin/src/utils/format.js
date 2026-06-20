export function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatProgram(code) {
  const labels = {
    plus2: "Plus 2",
    bca: "BCA",
    bhm: "BHM",
    bsw: "BSW",
  };
  return labels[code] ?? code?.toUpperCase?.() ?? code;
}
