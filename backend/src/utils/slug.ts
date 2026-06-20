export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uniqueSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(title) || "notice";
  let slug = base;
  let n = 2;
  while (await exists(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}
