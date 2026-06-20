import { Request } from "express";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { writeAuditLog } from "../../utils/audit";
import {
  DUMMY_PASSWORD_HASH,
  generateRefreshToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "../../utils/hash";
import { signAccessToken } from "../../utils/jwt";
import { AppError } from "../../utils/apiResponse";
import { AuthUser } from "../../types/auth";

const GENERIC_LOGIN_ERROR = "Invalid email or password";
const MAX_SESSIONS = 3;

function getClientMeta(req: Request) {
  return {
    ip: req.ip || req.socket.remoteAddress || "unknown",
    userAgent: req.get("user-agent") ?? undefined,
  };
}

async function logLoginAttempt(email: string, success: boolean, req: Request) {
  const { ip, userAgent } = getClientMeta(req);
  await prisma.loginAttempt.create({
    data: { email: email.toLowerCase(), ipAddress: ip, userAgent, success },
  });
}

export async function login(email: string, password: string, req: Request) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  const hashToCompare = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
  const valid = await verifyPassword(password, hashToCompare);

  if (!user || !valid) {
    if (user) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        attempts >= env.MAX_LOGIN_ATTEMPTS
          ? new Date(Date.now() + env.LOCKOUT_DURATION_MINUTES * 60 * 1000)
          : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
          lockedUntil,
        },
      });
    }

    await logLoginAttempt(normalizedEmail, false, req);
    await writeAuditLog({
      action: "LOGIN_FAILURE",
      metadata: { email: normalizedEmail },
      ipAddress: getClientMeta(req).ip,
    });

    throw new AppError(401, GENERIC_LOGIN_ERROR);
  }

  if (!user.isActive) {
    await logLoginAttempt(normalizedEmail, false, req);
    throw new AppError(401, GENERIC_LOGIN_ERROR);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    await logLoginAttempt(normalizedEmail, false, req);
    throw new AppError(401, GENERIC_LOGIN_ERROR);
  }

  const { ip, userAgent } = getClientMeta(req);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const activeTokens = await prisma.refreshToken.findMany({
    where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "asc" },
  });

  if (activeTokens.length >= MAX_SESSIONS) {
    const toRevoke = activeTokens.slice(0, activeTokens.length - MAX_SESSIONS + 1);
    await prisma.refreshToken.updateMany({
      where: { id: { in: toRevoke.map((t) => t.id) } },
      data: { revokedAt: new Date() },
    });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt,
        userAgent,
        ipAddress: ip,
      },
    }),
  ]);

  await logLoginAttempt(normalizedEmail, true, req);
  await writeAuditLog({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    ipAddress: ip,
  });

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return {
    user: { ...authUser, mustChangePassword: user.mustChangePassword },
    accessToken: signAccessToken(authUser),
    refreshToken,
  };
}

export async function refreshSession(refreshToken: string, req: Request) {
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    if (stored?.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId },
        data: { revokedAt: new Date() },
      });
      await writeAuditLog({
        userId: stored.userId,
        action: "TOKEN_REUSE_DETECTED",
        ipAddress: getClientMeta(req).ip,
      });
    }
    throw new AppError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user || !user.isActive) {
    throw new AppError(401, "Invalid refresh token");
  }

  const newRefreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const { ip, userAgent } = getClientMeta(req);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefreshToken),
        expiresAt,
        userAgent,
        ipAddress: ip,
      },
    }),
  ]);

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return {
    accessToken: signAccessToken(authUser),
    refreshToken: newRefreshToken,
    user: authUser,
  };
}

export async function logout(refreshToken: string | undefined, userId: number | undefined, req: Request) {
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken) },
      data: { revokedAt: new Date() },
    });
  }

  if (userId) {
    await writeAuditLog({
      userId,
      action: "LOGOUT",
      ipAddress: getClientMeta(req).ip,
    });
  }
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
  req: Request
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw new AppError(400, "Current password is incorrect");

  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  for (const entry of history) {
    if (await verifyPassword(newPassword, entry.passwordHash)) {
      throw new AppError(400, "Cannot reuse a recent password");
    }
  }

  const newHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.passwordHistory.create({
      data: { userId, passwordHash: user.passwordHash },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        passwordChangedAt: new Date(),
        mustChangePassword: false,
      },
    }),
    prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    }),
  ]);

  await writeAuditLog({
    userId,
    action: "PASSWORD_CHANGED",
    ipAddress: getClientMeta(req).ip,
  });
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      mustChangePassword: true,
    },
  });
  if (!user) throw new AppError(404, "User not found");
  return user;
}
