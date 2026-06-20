import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import cookie from "cookie";
import { env } from "./env";
import { verifyAccessToken } from "../utils/jwt";
import type { AuthUser } from "../types/auth";

export interface AuthenticatedSocket extends Socket {
  data: {
    user: AuthUser;
  };
}

let io: Server | null = null;

function parseAccessToken(socket: Socket): string | null {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.length > 0) {
    return authToken;
  }

  const header = socket.handshake.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const rawCookie = socket.handshake.headers.cookie;
  if (typeof rawCookie === "string") {
    const parsed = cookie.parse(rawCookie);
    if (parsed.accessToken) return parsed.accessToken;
  }

  return null;
}

function authenticateSocket(socket: Socket): AuthUser {
  const token = parseAccessToken(socket);
  if (!token) {
    throw new Error("Authentication required");
  }

  const user = verifyAccessToken(token);
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}

export function initSocket(httpServer: HttpServer): Server {
  if (io) return io;

  io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
    pingTimeout: 30_000,
    pingInterval: 25_000,
    transports: ["websocket", "polling"],
  });

  io.use((socket, next) => {
    try {
      const user = authenticateSocket(socket);
      (socket as AuthenticatedSocket).data = { user };
      next();
    } catch (err) {
      next(err instanceof Error ? err : new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const room = adminRoom(socket.data.user.id);
    void socket.join(room);

    socket.emit("notification:connected", {
      userId: socket.data.user.id,
      room,
    });

    socket.on("disconnect", (reason) => {
      if (!env.isProduction) {
        console.log(`[socket] admin ${socket.data.user.id} disconnected (${reason})`);
      }
    });
  });

  console.log("[socket] Notification server ready on /socket.io");
  return io;
}

export function getIO(): Server | null {
  return io;
}

export function adminRoom(userId: number): string {
  return `admin:${userId}`;
}

export async function closeSocket(): Promise<void> {
  if (!io) return;

  await new Promise<void>((resolve, reject) => {
    io!.close((err) => (err ? reject(err) : resolve()));
  });

  io = null;
}
