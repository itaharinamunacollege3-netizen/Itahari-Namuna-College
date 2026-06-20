import { Response } from "express";
import { env } from "../config/env";
import { sendSuccess } from "./apiResponse";
import { setAuthCookies } from "./cookies";

export interface AuthTokenPayload {
  accessToken: string;
  refreshToken: string;
  user: object;
}

/** Set httpOnly cookies and include tokens in JSON body (for Postman / API clients in dev). */
export function sendAuthSuccess(res: Response, result: AuthTokenPayload, status = 200) {
  setAuthCookies(res, result.accessToken, result.refreshToken);

  const data: Record<string, unknown> = {
    user: result.user,
  };

  // Expose tokens in JSON for Postman / API clients when not in production (or EXPOSE_AUTH_TOKENS_IN_BODY=true)
  if (env.exposeAuthTokensInBody) {
    data.accessToken = result.accessToken;
    data.refreshToken = result.refreshToken;
    data.tokenType = "Bearer";
    data.expiresIn = env.JWT_ACCESS_EXPIRES_IN;
  }

  sendSuccess(res, data, undefined, status);
}

export function getRefreshTokenFromRequest(
  cookies: Record<string, string> | undefined,
  body: Record<string, unknown> | undefined
): string | undefined {
  const fromCookie = cookies?.refreshToken;
  if (typeof fromCookie === "string" && fromCookie.length > 0) {
    return fromCookie;
  }

  const fromBody = body?.refreshToken;
  if (typeof fromBody === "string" && fromBody.length > 0) {
    return fromBody;
  }

  return undefined;
}
