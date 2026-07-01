import { getCloudinary, rethrowCloudinaryError } from "../config/cloudinary";
import { PDFDocument } from "pdf-lib";
import { env } from "../config/env";
import { AppError } from "../utils/apiResponse";
import {
  sanitizeUploadFilename,
  validateImageBuffer,
  validatePdfBuffer,
} from "../utils/imageValidation";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes?: number;
}

function albumFolder(albumSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/${albumSlug}`;
}

function noticeFolder(noticeSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/notices/${noticeSlug}`;
}

function programFolder(programSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/programs/${programSlug}`;
}

function blogFolder(blogSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/blogs/${blogSlug}`;
}

function journalFolder(journalSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/journals/${journalSlug}`;
}

function facilityFolder(facilitySlug: string) {
  return `${env.CLOUDINARY_FOLDER}/facilities/${facilitySlug}`;
}

function unitFolder(unitSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/units/${unitSlug}`;
}

function programSyllabusFolder(programSlug: string, semester: string) {
  return `${programFolder(programSlug)}/syllabus/semester-${semester}`;
}

/** Resize, convert to WebP, and compress before storage (values from .env). */
function galleryUploadOptions() {
  return {
    format: "webp" as const,
    transformation: [
      { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" as const },
      { quality: env.CLOUDINARY_WEBP_QUALITY },
    ],
  };
}

async function withCloudinary<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    rethrowCloudinaryError(err);
  }
}

async function compressPdfBuffer(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const pdf = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
    const compressed = await pdf.save({
      useObjectStreams: true,
      updateFieldAppearances: false,
    });
    return Buffer.from(compressed);
  } catch {
    return inputBuffer;
  }
}

export async function uploadGalleryImage(
  file: Express.Multer.File,
  albumSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: albumFolder(albumSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        ...galleryUploadOptions(),
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadGalleryImages(
  files: Express.Multer.File[],
  albumSlug: string
): Promise<CloudinaryUploadResult[]> {
  const uploads: CloudinaryUploadResult[] = [];

  for (const file of files) {
    uploads.push(await uploadGalleryImage(file, albumSlug));
  }

  return uploads;
}

export async function deleteCloudinaryImage(publicId: string | null | undefined) {
  await deleteCloudinaryAsset(publicId, "image");
}

export async function deleteCloudinaryImages(publicIds: (string | null | undefined)[]) {
  await Promise.all(publicIds.map((id) => deleteCloudinaryImage(id)));
}

export async function deleteCloudinaryAsset(
  publicId: string | null | undefined,
  resourceType: "image" | "raw" = "image"
) {
  if (!publicId) return;

  const cloudinary = getCloudinary();
  await withCloudinary(() =>
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  );
}

export async function uploadNoticePdf(
  file: Express.Multer.File,
  noticeSlug: string
): Promise<CloudinaryUploadResult> {
  if (file.mimetype !== "application/pdf") {
    throw new AppError(400, "Only PDF files are allowed");
  }
  const pdfCheck = validatePdfBuffer(file.buffer);
  if (!pdfCheck.valid) {
    const headerHex = file.buffer.subarray(0, 8).toString("hex");
    console.error("[PDF Upload Debug] File:", file.originalname, "MIME:", file.mimetype, "Size:", file.buffer.length, "Header hex:", headerHex);
    throw new AppError(400, pdfCheck.reason ?? "File is not a valid PDF");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:application/pdf;base64,${file.buffer.toString("base64")}`,
      {
        folder: noticeFolder(noticeSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "raw",
        overwrite: false,
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
  };
}

export async function uploadNoticeImage(
  file: Express.Multer.File,
  noticeSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: noticeFolder(noticeSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadProgramImage(
  file: Express.Multer.File,
  programSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: programFolder(programSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadBlogCoverImage(
  file: Express.Multer.File,
  blogSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: blogFolder(blogSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadBlogSectionImage(
  file: Express.Multer.File,
  blogSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: `${blogFolder(blogSlug)}/sections`,
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadJournalSectionImage(
  file: Express.Multer.File,
  journalSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: `${journalFolder(journalSlug)}/sections`,
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadJournalCoverImage(
  file: Express.Multer.File,
  journalSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: journalFolder(journalSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadJournalPdf(
  file: Express.Multer.File,
  journalSlug: string
): Promise<CloudinaryUploadResult> {
  if (file.mimetype !== "application/pdf") {
    throw new AppError(400, "Only PDF files are allowed");
  }

  const pdfCheck = validatePdfBuffer(file.buffer);
  if (!pdfCheck.valid) {
    throw new AppError(400, pdfCheck.reason ?? "File is not a valid PDF");
  }

  const compressedBuffer = await compressPdfBuffer(file.buffer);
  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:application/pdf;base64,${compressedBuffer.toString("base64")}`,
      {
        folder: `${journalFolder(journalSlug)}/pdf`,
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "raw",
        overwrite: false,
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
  };
}

export async function uploadBlogPdf(
  file: Express.Multer.File,
  blogSlug: string
): Promise<CloudinaryUploadResult> {
  if (file.mimetype !== "application/pdf") {
    throw new AppError(400, "Only PDF files are allowed");
  }

  const pdfCheck = validatePdfBuffer(file.buffer);
  if (!pdfCheck.valid) {
    throw new AppError(400, pdfCheck.reason ?? "File is not a valid PDF");
  }

  const compressedBuffer = await compressPdfBuffer(file.buffer);
  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:application/pdf;base64,${compressedBuffer.toString("base64")}`,
      {
        folder: `${blogFolder(blogSlug)}/pdf`,
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "raw",
        overwrite: false,
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
  };
}

export async function uploadProgramSyllabusPdf(
  file: Express.Multer.File,
  programSlug: string,
  semester: string
): Promise<CloudinaryUploadResult> {
  if (file.mimetype !== "application/pdf") {
    throw new AppError(400, "Only PDF files are allowed");
  }

  const pdfCheck = validatePdfBuffer(file.buffer);
  if (!pdfCheck.valid) {
    throw new AppError(400, pdfCheck.reason ?? "File is not a valid PDF");
  }

  const compressedBuffer = await compressPdfBuffer(file.buffer);

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:application/pdf;base64,${compressedBuffer.toString("base64")}`,
      {
        folder: programSyllabusFolder(programSlug, semester),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "raw",
        overwrite: false,
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
  };
}

export async function uploadFacilityImage(
  file: Express.Multer.File,
  facilitySlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: facilityFolder(facilitySlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadUnitIcon(
  file: Express.Multer.File,
  unitSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: unitFolder(unitSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}
