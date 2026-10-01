-- Add optional country of residence to trip inquiries.
-- Additive migration; preserves all existing inquiry rows.

ALTER TABLE "TripInquiry" ADD COLUMN "country" TEXT;