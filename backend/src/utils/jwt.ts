import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthUser } from "../types/auth";

export function signAccessToken(user: AuthUser): string { // sign the access token
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );
}

export function verifyAccessToken(token: string): AuthUser { // verify the access token
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
  return { // return the user
    id: Number(payload.sub), // return the user id
    email: String(payload.email), // return the user email
    name: String(payload.name ?? ""), // return the user name
    role: String(payload.role), // return the user role
  };
}
