import { apiRequest } from "./apiClient";
import { ExamSession, ParsedRow, UploadSummary, CreateExamSessionPayload } from "../types/examResult.types";

export const examResultService = {
  // Returns `{ data, meta }` to be compatible with useAsyncData
  listSessions: async () => {
    return apiRequest("/admin/results/sessions");
  },

  // Returns the unwrapped data for direct usage in handlers
  createSession: async (payload: CreateExamSessionPayload): Promise<ExamSession> => {
    const res = await apiRequest("/admin/results/sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data as ExamSession;
  },

  uploadExcel: async (
    sessionId: string,
    file: File
  ): Promise<{ rows: ParsedRow[]; summary: UploadSummary }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiRequest(`/admin/results/sessions/${sessionId}/upload`, {
      method: "POST",
      body: formData,
    });
    return res.data as { rows: ParsedRow[]; summary: UploadSummary };
  },

  previewStaged: async (sessionId: string): Promise<ParsedRow[]> => {
    const res = await apiRequest(`/admin/results/sessions/${sessionId}/preview`);
    return res.data as ParsedRow[];
  },

  commitImport: async (
    sessionId: string
  ): Promise<{ imported: number; skipped: number; totalValid: number }> => {
    const res = await apiRequest(`/admin/results/sessions/${sessionId}/commit`, {
      method: "POST",
    });
    return res.data as { imported: number; skipped: number; totalValid: number };
  },

  togglePublish: async (sessionId: string, isPublished: boolean): Promise<ExamSession> => {
    const res = await apiRequest(`/admin/results/sessions/${sessionId}/publish`, {
      method: "PUT",
      body: JSON.stringify({ isPublished }),
    });
    return res.data as ExamSession;
  },
};