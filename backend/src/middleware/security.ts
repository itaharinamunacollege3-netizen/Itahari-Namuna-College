import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import { AppError } from "../utils/apiResponse";

const DISALLOWED_OBJECT_KEYS = new Set(["__proto__", "prototype", "constructor"]);

// Common SQLi signatures used in query/param payloads.
const SQLI_PATTERN =
  /(\bunion(\s+all)?\s+select\b|\bselect\b.+\bfrom\b|\binsert\s+into\b|\bupdate\b.+\bset\b|\bdelete\s+from\b|\bdrop\s+table\b|\balter\s+table\b|\btruncate\s+table\b|\bexec(\s|\()|\bxp_cmdshell\b|--|\/\*|\*\/)/i;

function sanitizeString(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

function assertSafeObjectKeys(value: unknown, path = "request"): void {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSafeObjectKeys(item, `${path}[${index}]`));
    return;
  }

  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (DISALLOWED_OBJECT_KEYS.has(key) || key.startsWith("$")) {
      throw new AppError(400, `Unsafe key "${key}" in ${path}`);
    }
    assertSafeObjectKeys(nested, `${path}.${key}`);
  }
}

function sanitizeDeep(value: unknown): unknown {
  if (typeof value === "string") return sanitizeString(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeDeep(item));
  if (!value || typeof value !== "object") return value;

  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    result[key] = sanitizeDeep(nested);
  }
  return result;
}

function assertNoSqlInjection(
  value: unknown,
  source: "query" | "params",
  path: string = source
): void {
  if (typeof value === "string") {
    if (SQLI_PATTERN.test(value)) {
      throw new AppError(400, `Potential SQL injection detected in ${path}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSqlInjection(item, source, `${path}[${index}]`));
    return;
  }

  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    assertNoSqlInjection(nested, source, `${path}.${key}`);
  }
}

export function requestSecurityMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    assertSafeObjectKeys(req.body, "body");
    assertSafeObjectKeys(req.query, "query");
    assertSafeObjectKeys(req.params, "params");

    req.body = sanitizeDeep(req.body);
    const sanitizedQuery = sanitizeDeep(req.query);
    const sanitizedParams = sanitizeDeep(req.params);

    // NOTE: Express 5 exposes req.query as a getter-only property,
    // so we sanitize for validation without reassigning req.query/req.params.
    assertNoSqlInjection(sanitizedQuery, "query");
    assertNoSqlInjection(sanitizedParams, "params");

    next();
  } catch (err) {
    next(err);
  }
}
