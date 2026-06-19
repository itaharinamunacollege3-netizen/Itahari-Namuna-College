declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        role: string;
      };
      validatedQuery?: Record<string, unknown>;
      validatedBody?: unknown;
      admissionApplication?: {
        id: number;
        status: string;
        accessTokenHash: string;
      };
    }
  }
}

export {};
