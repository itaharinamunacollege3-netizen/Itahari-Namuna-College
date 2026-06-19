import type { Staff, StaffCategory } from "../../generated/prisma/client";

type StaffWithCategory = Staff & { category?: StaffCategory | null };

export function formatStaffForApi(staff: StaffWithCategory) {
  return {
    id: staff.id,
    name: staff.name,
    role: staff.role,
    department: staff.department,
    image: staff.photo,
    category: staff.category
      ? { id: staff.category.id, name: staff.category.name, slug: staff.category.slug }
      : null,
    sortOrder: staff.sortOrder,
    published: staff.published,
  };
}

export function formatStaffGrouped(staffList: StaffWithCategory[]) {
  const grouped: Record<string, ReturnType<typeof formatStaffForApi>[]> = {};

  for (const staff of staffList) {
    const key = staff.category?.slug ?? "uncategorized";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(formatStaffForApi(staff));
  }

  return grouped;
}
