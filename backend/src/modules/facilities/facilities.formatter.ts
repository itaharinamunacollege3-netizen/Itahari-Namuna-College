import type { Facility } from "../../generated/prisma/client";
import type { FacilityDetailDto, FacilityListItemDto } from "./facilities.types";

function parseSpecs(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((s) => s.trim()).filter(Boolean) : [];
}

export function formatFacilityListItem(facility: Facility): FacilityListItemDto {
  return {
    id: facility.id,
    slug: facility.slug,
    index: facility.index,
    category: facility.category,
    title: facility.title,
    tagline: facility.tagline,
    descriptionPart1: facility.descriptionPart1,
    descriptionPart2: facility.descriptionPart2,
    imageUrl: facility.imageUrl ?? "",
    specs: parseSpecs(facility.specs),
    featured: facility.featured,
    published: facility.published,
    sortOrder: facility.sortOrder,
  };
}

export function formatFacilityDetail(facility: Facility): FacilityDetailDto {
  return {
    ...formatFacilityListItem(facility),
  };
}
