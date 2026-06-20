import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { uniqueSlug } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import { deleteCloudinaryAsset, uploadProgramImage } from "../../services/cloudinary.service";
import { formatProgramAdmin, formatProgramPublic } from "./programs.formatter";
import type { ListProgramsParams, ProgramWriteInput, ReorderProgramItem } from "./programs.types";

function sanitizeOverview(text: string) {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

function deriveCode(slug: string, code?: string) {
  if (code?.trim()) return code.trim().toUpperCase();
  return slug.replace(/-/g, " ").toUpperCase();
}

function buildWhere(params: ListProgramsParams) {
  const where: Record<string, unknown> = {};
  if (params.publishedOnly !== false) where.published = true;
  if (params.featured) where.isFeatured = true;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { code: { contains: params.search, mode: "insensitive" } },
      { overview: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function mapWriteInputToDb(data: ProgramWriteInput, slug: string) {
  return {
    slug,
    title: data.title.trim(),
    code: deriveCode(slug, data.code),
    image: data.image?.trim() || null,
    duration: data.duration?.trim() || null,
    university: data.university?.trim() || null,
    tagline: data.tagline?.trim() || null,
    overview: sanitizeOverview(data.overview),
    objectives: data.objectives,
    careerPathways: data.careerPathways,
    eligibility: data.eligibility,
    highlights: data.highlights,
    curriculum: data.curriculum,
    seats: data.seats ?? null,
    isFeatured: data.isFeatured ?? true,
    sortOrder: data.sortOrder ?? 0,
    published: data.published ?? true,
  };
}

export async function listProgramsPublic(featured?: boolean) {
  const programs = await prisma.program.findMany({
    where: buildWhere({ publishedOnly: true, featured }),
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  return programs.map(formatProgramPublic);
}

export async function getProgramBySlug(slug: string) {
  const program = await prisma.program.findFirst({
    where: { slug, published: true },
  });
  if (!program) throw new AppError(404, "Program not found");
  return formatProgramPublic(program);
}

export async function listProgramsAdmin(params: ListProgramsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 50;
  const where = buildWhere({ ...params, publishedOnly: false });

  const [items, total] = await Promise.all([
    prisma.program.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.program.count({ where }),
  ]);

  return {
    items: items.map(formatProgramAdmin),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProgramAdminById(id: number) {
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, "Invalid program id");

  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) throw new AppError(404, "Program not found");
  return formatProgramAdmin(program);
}

export async function createProgram(data: ProgramWriteInput) {
  const slug =
    data.slug?.trim() ||
    (await uniqueSlug(data.title, async (s) => !!(await prisma.program.findUnique({ where: { slug: s } }))));

  const existing = await prisma.program.findUnique({ where: { slug } });
  if (existing) throw new AppError(409, "Program slug already exists");

  const program = await prisma.program.create({
    data: mapWriteInputToDb(data, slug),
  });

  return formatProgramAdmin(program);
}

export async function updateProgram(id: number, data: Partial<ProgramWriteInput>) {
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Program not found");

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.code !== undefined) updateData.code = deriveCode(existing.slug, data.code);
  if (data.image !== undefined) updateData.image = data.image?.trim() || null;
  if (data.duration !== undefined) updateData.duration = data.duration?.trim() || null;
  if (data.university !== undefined) updateData.university = data.university?.trim() || null;
  if (data.tagline !== undefined) updateData.tagline = data.tagline?.trim() || null;
  if (data.overview !== undefined) updateData.overview = sanitizeOverview(data.overview);
  if (data.objectives !== undefined) updateData.objectives = data.objectives;
  if (data.careerPathways !== undefined) updateData.careerPathways = data.careerPathways;
  if (data.eligibility !== undefined) updateData.eligibility = data.eligibility;
  if (data.highlights !== undefined) updateData.highlights = data.highlights;
  if (data.curriculum !== undefined) updateData.curriculum = data.curriculum;
  if (data.seats !== undefined) updateData.seats = data.seats;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
  if (data.published !== undefined) updateData.published = data.published;

  if (data.slug && data.slug !== existing.slug) {
    const taken = await prisma.program.findUnique({ where: { slug: data.slug } });
    if (taken && taken.id !== id) throw new AppError(409, "Program slug already exists");
    updateData.slug = data.slug;
    if (data.code === undefined) updateData.code = deriveCode(data.slug);
  } else if (data.title && !data.slug) {
    const nextSlug = await uniqueSlug(data.title, async (s) => {
      const found = await prisma.program.findUnique({ where: { slug: s } });
      return !!found && found.id !== id;
    });
    updateData.slug = nextSlug;
    if (data.code === undefined) updateData.code = deriveCode(nextSlug);
  }

  const program = await prisma.program.update({
    where: { id },
    data: updateData,
  });

  return formatProgramAdmin(program);
}

export async function deleteProgram(id: number) {
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Program not found");
  await prisma.program.delete({ where: { id } });
}

export async function reorderPrograms(items: ReorderProgramItem[]) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.program.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  const programs = await prisma.program.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  return programs.map(formatProgramAdmin);
}

export async function uploadProgramCover(id: number, file: Express.Multer.File) {
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Program not found");

  const upload = await uploadProgramImage(file, existing.slug);
  const program = await prisma.program.update({
    where: { id },
    data: { image: upload.url },
  });

  return formatProgramAdmin(program);
}

export async function removeProgramCover(id: number) {
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Program not found");

  if (existing.image?.includes("res.cloudinary.com")) {
    const publicId = extractCloudinaryPublicId(existing.image);
    await deleteCloudinaryAsset(publicId, "image");
  }

  const program = await prisma.program.update({
    where: { id },
    data: { image: null },
  });

  return formatProgramAdmin(program);
}

function extractCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match?.[1] ?? null;
}
