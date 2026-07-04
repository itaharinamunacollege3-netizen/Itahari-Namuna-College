import { ResultStatus } from "../../generated/prisma/client";
import * as XLSX from "xlsx";
import { RESULT_EXCEL_HEADERS } from "../../utils/resultTemplate";
import { ParsedResultRow, CreateExamSessionInput } from "./examResult.types";
import { prisma } from "../../config/prisma";

// In-memory staging (swap for Redis if you run multiple instances)
const stagingStore = new Map<string, ParsedResultRow[]>();

export const examResultService = {
  createSession: (input: CreateExamSessionInput, adminId: string | number) => {
    return prisma.examSession.create({
      data: {
        examName: input.examName,
        examType: input.examType,
        program: input.program,
        examDate: new Date(input.examDate),
        createdBy: String(adminId),
      },
    });
  },

  listAllSessions: () => {
    return prisma.examSession.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { results: true } } },
    });
  },

  listPublishedSessions: () => {
    return prisma.examSession.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        examName: true,
        examType: true,
        program: true,
        examDate: true,
        publishedAt: true,
      },
      orderBy: { examDate: "desc" },
    });
  },

  getSessionById: (sessionId: string) => {
    return prisma.examSession.findUnique({ where: { id: sessionId } });
  },

  togglePublish: (sessionId: string, isPublished: boolean) => {
    return prisma.examSession.update({
      where: { id: sessionId },
      data: { isPublished, publishedAt: isPublished ? new Date() : null },
    });
  },

  parseExcelBuffer: (buffer: Buffer): { rows: ParsedResultRow[]; missingHeaders: string[] } => {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (rawRows.length === 0) {
      return { rows: [], missingHeaders: [] };
    }

    const actualHeaders = Object.keys(rawRows[0]);
    const missingHeaders = RESULT_EXCEL_HEADERS.filter((h) => !actualHeaders.includes(h));
    if (missingHeaders.length > 0) {
      return { rows: [], missingHeaders };
    }

    const rows: ParsedResultRow[] = rawRows.map((row, idx) => {
      const errors: string[] = [];
      const symbolNumber = String(row.SymbolNumber ?? "").trim();
      const studentName = String(row.StudentName ?? "").trim();
      const program = String(row.Program ?? "").trim();
      const obtainedMarks = Number(row.ObtainedMarks);
      const totalMarks = Number(row.TotalMarks);
      const status = String(row.Status ?? "").trim().toUpperCase() as ResultStatus;

      if (!symbolNumber) errors.push("Missing SymbolNumber");
      if (!studentName) errors.push("Missing StudentName");
      if (!program) errors.push("Missing Program");
      if (isNaN(obtainedMarks)) errors.push("ObtainedMarks must be a number");
      if (isNaN(totalMarks) || totalMarks <= 0) errors.push("TotalMarks must be a positive number");
      if (!["PASS", "FAIL", "ABSENT"].includes(status)) errors.push("Status must be PASS, FAIL, or ABSENT");

      const percentage =
        !isNaN(obtainedMarks) && !isNaN(totalMarks) && totalMarks > 0
          ? Math.round((obtainedMarks / totalMarks) * 10000) / 100
          : 0;

      return {
        symbolNumber,
        studentName,
        program,
        obtainedMarks,
        totalMarks,
        status,
        percentage,
        rowIndex: idx + 2,
        errors,
      };
    });

    const seen = new Map<string, number>();
    rows.forEach((r) => {
      if (!r.symbolNumber) return;
      if (seen.has(r.symbolNumber)) {
        r.errors.push(`Duplicate SymbolNumber in file (also row ${seen.get(r.symbolNumber)})`);
      } else {
        seen.set(r.symbolNumber, r.rowIndex);
      }
    });

    return { rows, missingHeaders: [] };
  },

  stageRows: (sessionId: string, rows: ParsedResultRow[]) => {
    stagingStore.set(sessionId, rows);
  },

  getStagedRows: (sessionId: string) => {
    return stagingStore.get(sessionId) ?? null;
  },

  clearStagedRows: (sessionId: string) => {
    stagingStore.delete(sessionId);
  },

  commitStagedRows: async (sessionId: string) => {
    const staged = stagingStore.get(sessionId);
    if (!staged) return null;

    const validRows = staged.filter((r) => r.errors.length === 0);
    if (validRows.length === 0) {
      return { imported: 0, skipped: 0, totalValid: 0 };
    }

    const result = await prisma.examResult.createMany({
      data: validRows.map((r) => ({
        examSessionId: sessionId,
        symbolNumber: r.symbolNumber,
        studentName: r.studentName,
        program: r.program,
        obtainedMarks: r.obtainedMarks,
        totalMarks: r.totalMarks,
        percentage: r.percentage,
        status: r.status as ResultStatus,
      })),
      skipDuplicates: true,
    });

    stagingStore.delete(sessionId);

    return { imported: result.count, skipped: validRows.length - result.count, totalValid: validRows.length };
  },

  lookupBySymbol: async (sessionId: string, symbolNumber: string) => {
    const session = await prisma.examSession.findUnique({ where: { id: sessionId } });
    if (!session || !session.isPublished) return null;

    const result = await prisma.examResult.findUnique({
      where: {
        examSessionId_symbolNumber: { examSessionId: sessionId, symbolNumber },
      },
    });
    if (!result) return null;

    return {
      symbolNumber: result.symbolNumber,
      studentName: result.studentName,
      program: result.program,
      obtainedMarks: result.obtainedMarks,
      totalMarks: result.totalMarks,
      percentage: result.percentage,
      status: result.status,
      examName: session.examName,
      examDate: session.examDate,
    };
  },
};