import type { Unit } from "../../generated/prisma/client";
import type { UnitDetailDto, UnitListItemDto } from "./units.types";

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((s) => s.trim()).filter(Boolean) : [];
}

function parseActionPlan(value: unknown): Array<{ sn: number; activity: string; byWhen: string; byWho: string; budget: string }> {
  return Array.isArray(value)
    ? value.map((item) => ({
        sn: item.sn ?? 0,
        activity: String(item.activity ?? "").trim(),
        byWhen: String(item.byWhen ?? "").trim(),
        byWho: String(item.byWho ?? "").trim(),
        budget: String(item.budget ?? "").trim(),
      }))
    : [];
}

export function formatUnitListItem(unit: Unit & { category?: { name: string } }): UnitListItemDto {
  return {
    id: unit.id,
    slug: unit.slug,
    code: unit.code,
    categoryId: unit.categoryId,
    category: unit.category?.name ?? "",
    title: unit.title,
    objectives: parseStringArray(unit.objectives),
    duties: parseStringArray(unit.duties),
    actionPlan: parseActionPlan(unit.actionPlan),
    iconUrl: unit.iconUrl ?? "",
    featured: unit.featured,
    published: unit.published,
    sortOrder: unit.sortOrder,
  };
}

export function formatUnitDetail(unit: Unit & { category?: { name: string } }): UnitDetailDto {
  return {
    ...formatUnitListItem(unit),
  };
}
