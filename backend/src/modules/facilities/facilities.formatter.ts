import type { Facility } from "../../generated/prisma/client";
import type { FacilityDetailDto, FacilityListItemDto } from "./facilities.types";

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((s) => s.trim()).filter(Boolean) : [];
}

export function formatFacilityListItem(facility: Facility & { category?: { name: string } }): FacilityListItemDto {
  return {
    id: facility.id,
    slug: facility.slug,
    index: facility.index,
    categoryId: facility.categoryId,
    category: facility.category?.name ?? "",
    title: facility.title,
    tagline: facility.tagline,
    descriptions: parseStringArray(facility.descriptions),
    imageUrl: facility.imageUrl ?? "",
    specs: parseStringArray(facility.specs),
    featured: facility.featured,
    published: facility.published,
    sortOrder: facility.sortOrder,
  };
}

export function formatFacilityDetail(facility: Facility & { category?: { name: string } }): FacilityDetailDto {
  return {
    ...formatFacilityListItem(facility),
  };
}
