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

export interface CreateExamSessionInput {
  examName: string;
  examType: "PLUS2_ENTRANCE" | "BACHELOR_ENTRANCE";
  program: string;
  examDate: string;
}