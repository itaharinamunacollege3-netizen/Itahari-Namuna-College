import type { AdmissionApplication } from "../../generated/prisma/client";

const programToApi = {
  PLUS2: "plus2",
  BCA: "bca",
  BHM: "bhm",
  BSW: "bsw",
} as const;

const streamToApi = {
  SCIENCE: "science",
  MANAGEMENT: "management",
  HUMANITIES: "humanities",
  EDUCATION: "education",
} as const;

const statusToApi = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type ApiProgram = (typeof programToApi)[keyof typeof programToApi];
export type ApiStream = (typeof streamToApi)[keyof typeof streamToApi];
export type ApiStatus = (typeof statusToApi)[keyof typeof statusToApi];

export interface AdmissionApiDto {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  programApplied: ApiProgram;
  plus2Stream: ApiStream | null;
  session: string | null;
  status: ApiStatus;
  adminNotes: string | null;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionListItemDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  programApplied: ApiProgram;
  plus2Stream: ApiStream | null;
  status: ApiStatus;
  session: string | null;
  createdAt: string;
}

export function formatAdmissionForApi(application: AdmissionApplication): AdmissionApiDto {
  return {
    id: application.id,
    fullName: application.fullName,
    email: application.email,
    gender: application.gender,
    phone: application.phone,
    address: application.address,
    programApplied: programToApi[application.programApplied],
    plus2Stream: application.plus2Stream ? streamToApi[application.plus2Stream] : null,
    session: application.session,
    status: statusToApi[application.status],
    adminNotes: application.adminNotes,
    canEdit: application.status === "PENDING" || application.status === "UNDER_REVIEW",
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}

export function formatAdmissionListItem(application: AdmissionApplication): AdmissionListItemDto {
  return {
    id: application.id,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    programApplied: programToApi[application.programApplied],
    plus2Stream: application.plus2Stream ? streamToApi[application.plus2Stream] : null,
    status: statusToApi[application.status],
    session: application.session,
    createdAt: application.createdAt.toISOString(),
  };
}

export function formatAdmissionCsvRow(application: AdmissionApplication): string {
  const fields = [
    application.id,
    application.fullName,
    application.email,
    application.gender,
    application.phone,
    application.address,
    programToApi[application.programApplied],
    application.plus2Stream ? streamToApi[application.plus2Stream] : "",
    application.session ?? "",
    statusToApi[application.status],
    application.adminNotes ?? "",
    application.createdAt.toISOString(),
  ];

  return fields
    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
    .join(",");
}

export const ADMISSION_CSV_HEADER =
  "id,fullName,email,gender,phone,address,programApplied,plus2Stream,session,status,adminNotes,createdAt";
