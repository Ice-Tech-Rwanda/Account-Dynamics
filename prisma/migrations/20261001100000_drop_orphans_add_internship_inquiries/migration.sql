-- DropForeignKey
ALTER TABLE "ConsultationRequest" DROP CONSTRAINT "ConsultationRequest_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "MembershipPlan" DROP CONSTRAINT "MembershipPlan_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "QuoteRequest" DROP CONSTRAINT "QuoteRequest_assignedToId_fkey";

-- DropTable
DROP TABLE "ConsultationRequest";

-- DropTable
DROP TABLE "MembershipPlan";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "QuoteRequest";

-- DropTable
DROP TABLE "SoftwareTool";

-- DropTable
DROP TABLE "Testimonial";

-- DropEnum
DROP TYPE "ConsultationStatus";

-- DropEnum
DROP TYPE "QuoteStatus";

-- CreateTable
CREATE TABLE "InternshipInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "university" TEXT,
    "fieldOfStudy" TEXT,
    "programType" TEXT,
    "preferredStartDate" TEXT,
    "duration" TEXT,
    "areasOfInterest" TEXT,
    "message" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternshipInquiry_email_idx" ON "InternshipInquiry"("email");

-- CreateIndex
CREATE INDEX "InternshipInquiry_status_idx" ON "InternshipInquiry"("status");

-- CreateIndex
CREATE INDEX "InternshipInquiry_archived_idx" ON "InternshipInquiry"("archived");

-- CreateIndex
CREATE INDEX "InternshipInquiry_createdAt_idx" ON "InternshipInquiry"("createdAt");

-- CreateIndex
CREATE INDEX "InternshipInquiry_assignedToId_idx" ON "InternshipInquiry"("assignedToId");

-- AddForeignKey
ALTER TABLE "InternshipInquiry" ADD CONSTRAINT "InternshipInquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

