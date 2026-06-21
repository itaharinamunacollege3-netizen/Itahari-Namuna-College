import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { clearAuthCookies } from "../../utils/cookies";
import { sendSuccess, AppError } from "../../utils/apiResponse";
import { sendAuthSuccess, getRefreshTokenFromRequest } from "../../utils/authResponse";
import { AuthUser } from "../../types/auth";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password, req);
    sendAuthSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getRefreshTokenFromRequest(req.cookies, req.body);
    if (!token) {
      throw new AppError(
        401,
        "Refresh token required. Send cookie refreshToken or JSON body: { \"refreshToken\": \"...\" }"
      );
    }

    const result = await authService.refreshSession(token, req);
    sendAuthSuccess(res, {
      user: result.user as AuthUser,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = getRefreshTokenFromRequest(req.cookies, req.body);
    await authService.logout(refreshToken, req.user?.id, req);
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

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body;
    const user = await authService.updateProfile(req.user!.id, { name, email }, req);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) throw new AppError(400, "Avatar image is required");
    const user = await authService.uploadAvatar(req.user!.id, file, req);
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
