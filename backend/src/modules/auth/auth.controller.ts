import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { setAuthCookies, clearAuthCookies } from "../../utils/cookies";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/apiResponse";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password, req);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    sendSuccess(res, { user: result.user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new AppError(401, "Refresh token required");
    const result = await authService.refreshSession(token, req);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    sendSuccess(res, { user: result.user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logout(req.cookies?.refreshToken, req.user?.id, req);
    clearAuthCookies(res);
    sendSuccess(res, { message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.id, currentPassword, newPassword, req);
    clearAuthCookies(res);
    sendSuccess(res, { message: "Password changed. Please log in again." });
  } catch (err) {
    next(err);
  }
}
