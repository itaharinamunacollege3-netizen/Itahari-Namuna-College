const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function isAllowedImageMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

/** Verify file content matches declared image type (magic bytes). */
export function validateImageBuffer(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const isWebp =
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";

  if (mime === "image/jpeg") return isJpeg;
  if (mime === "image/png") return isPng;
  if (mime === "image/webp") return isWebp;

  return false;
}

export function validatePdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.toString("ascii", 0, 4) === "%PDF";
}

export function sanitizeUploadFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}
