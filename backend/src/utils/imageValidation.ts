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

export function validatePdfBuffer(buffer: Buffer): { valid: boolean; reason?: string } {
  if (buffer.length < 4) {
    return { valid: false, reason: "File is too small or empty" };
  }

  const header = buffer.toString("ascii", 0, 4);

  if (header === "%PDF") {
    return { valid: true };
  }

  // Detect common wrong file types
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: false, reason: "File is a PNG image, not a PDF" };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: false, reason: "File is a JPEG image, not a PDF" };
  }
  if (header === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return { valid: false, reason: "File is a WebP image, not a PDF" };
  }
  if (header === "PK\x03\x04") {
    return { valid: false, reason: "File is a ZIP/Office document (Word/Excel), not a PDF" };
  }
  if (header === "<!DO" || header === "<htm" || header === "<HTM") {
    return { valid: false, reason: "File is HTML, not a PDF" };
  }

  return { valid: false, reason: "File is not a valid PDF (must start with %PDF header)" };
}

export function sanitizeUploadFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}
