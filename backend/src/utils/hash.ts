import { createHash, randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { env } from "../config/env";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateRefreshToken(): string {
  return randomBytes(48).toString("hex");
}

export async function hashPassword(password: string): Promise<string> { // hash the password
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> { // verify the password
  return bcrypt.compare(password, hash);
}

export const DUMMY_PASSWORD_HASH = // dummy password hash for testing
  "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oX9V5K9qK8eK";
