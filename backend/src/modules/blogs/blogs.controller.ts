import { Request, Response, NextFunction } from "express";
import * as blogsService from "./blogs.service";
import { sendSuccess, AppError } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { getBlogUploadFiles, getUploadedFile } from "../../middleware/upload";
import { listBlogsQuerySchema } from "./blogs.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listBlogsQuerySchema>;

function getListQuery(req: Request): ListQuery {
  return (req.validatedQuery ?? {}) as ListQuery;
}

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await blogsService.listBlogs({
      page: query.page,
      limit: query.limit,
      search: query.search,
      category: query.category,
      tag: query.tag,
      publishedOnly: true,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await blogsService.getFeaturedBlog();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getPopular(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(Number(req.query.limit) || 4, 10);
    const data = await blogsService.getPopularBlogs(limit);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await blogsService.listBlogCategories();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.id);
    const data = await blogsService.getBlogByIdentifier(idOrSlug, true);
    void blogsService.incrementBlogViewCount(idOrSlug);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getRelated(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.id);
    const post = await blogsService.getBlogByIdentifier(idOrSlug, true);
    const data = await blogsService.getRelatedBlogs(post.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await blogsService.listBlogs({
      page: query.page,
      limit: query.limit,
      search: query.search,
      category: query.category,
      tag: query.tag,
      publishedOnly: false,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getAdminById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await blogsService.getBlogById(id, false);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const files = getBlogUploadFiles(req);
    const data = await blogsService.createBlog(req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_BLOG",
      resource: "blogs",
      resourceId: data.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const files = getBlogUploadFiles(req);
    const data = await blogsService.updateBlog(id, req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_BLOG",
      resource: "blogs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await blogsService.deleteBlog(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_BLOG",
      resource: "blogs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Blog post deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadCover(req: Request, res: Response, next: NextFunction) {
  try {
    const file = getUploadedFile(req, "cover");
    if (!file) throw new AppError(400, "Cover image file is required");

    const id = Number(req.params.id);
    const data = await blogsService.uploadBlogCover(id, file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_BLOG_COVER",
      resource: "blogs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function removeCover(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await blogsService.removeBlogCover(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_BLOG_COVER",
      resource: "blogs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function uploadAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    const file = getUploadedFile(req, "attachment");
    if (!file) throw new AppError(400, "Attachment file is required");

    const id = Number(req.params.id);
    const data = await blogsService.uploadBlogAttachment(id, file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_BLOG_ATTACHMENT",
      resource: "blogs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function removeAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await blogsService.removeBlogAttachment(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_BLOG_ATTACHMENT",
      resource: "blogs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
