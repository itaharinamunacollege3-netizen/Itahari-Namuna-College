-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('PLUS2_ENTRANCE', 'BACHELOR_ENTRANCE');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('PASS', 'FAIL', 'ABSENT');

-- CreateTable
CREATE TABLE "exam_sessions" (
    "id" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "examType" "ExamType" NOT NULL,
    "program" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_results" (
    "id" TEXT NOT NULL,
    "examSessionId" TEXT NOT NULL,
    "symbolNumber" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "obtainedMarks" DOUBLE PRECISION NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "status" "ResultStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exam_results_symbolNumber_idx" ON "exam_results"("symbolNumber");

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_examSessionId_symbolNumber_key" ON "exam_results"("examSessionId", "symbolNumber");

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_examSessionId_fkey" FOREIGN KEY ("examSessionId") REFERENCES "exam_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
