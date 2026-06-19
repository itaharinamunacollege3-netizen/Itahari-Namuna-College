export interface ListAdmissionsParams {
  page?: number;
  limit?: number;
  status?: "pending" | "under_review" | "approved" | "rejected";
  program?: "plus2" | "bca" | "bhm" | "bsw";
  search?: string;
}

export interface AdmissionSubmitResult {
  id: number;
  status: "pending";
  programApplied: string;
  plus2Stream: string | null;
  accessToken: string;
  message: string;
}
