// src/utils/resultTemplate.ts
export const RESULT_EXCEL_HEADERS = [
  "SymbolNumber",
  "StudentName",
  "Program",
  "ObtainedMarks",
  "TotalMarks",
  "Status",
] as const;

export interface ParsedResultRow {
  symbolNumber: string;
  studentName: string;
  program: string;
  obtainedMarks: number;
  totalMarks: number;
  status: "PASS" | "FAIL" | "ABSENT";
  percentage: number;
  rowIndex: number;
  errors: string[];
}