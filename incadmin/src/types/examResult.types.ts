export interface ExamSession {
  id: string;
  examName: string;
  examType: "PLUS2_ENTRANCE" | "BACHELOR_ENTRANCE";
  program: string;
  examDate: string;
  isPublished: boolean;
  publishedAt: string | null;
  _count: { results: number };
}

export interface ParsedRow {
  symbolNumber: string;
  studentName: string;
  program: string;
  obtainedMarks: number;
  totalMarks: number;
  status: string;
  percentage: number;
  rowIndex: number;
  errors: string[];
}

export interface UploadSummary {
  total: number;
  valid: number;
  invalid: number;
}

export interface CreateExamSessionPayload {
  examName: string;
  examType: "PLUS2_ENTRANCE" | "BACHELOR_ENTRANCE";
  program: string;
  examDate: string;
}