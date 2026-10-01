-- Tourism content and trip inquiry models added for the Global Line Safaris CMS.
-- This migration is additive and preserves all existing users, content, and leads.

CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "location" TEXT,
    "category" TEXT,
    "image" TEXT,
    "galleryImages" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TourPackage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT,
    "category" TEXT,
    "duration" TEXT,
    "price" TEXT,
    "priceNote" TEXT,
    "overview" TEXT NOT NULL DEFAULT '',
    "facts" TEXT,
    "highlights" TEXT,
    "itinerary" TEXT,
    "inclusions" TEXT,
    "exclusions" TEXT,
    "note" TEXT,
    "image" TEXT,
    "galleryImages" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourPackage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "travelDate" TEXT,
    "duration" TEXT,
    "travelers" TEXT,
    "preferredPackage" TEXT,
    "budget" TEXT,
    "destination" TEXT,
    "message" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripInquiry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");
CREATE INDEX "Destination_status_idx" ON "Destination"("status");
CREATE INDEX "Destination_featured_idx" ON "Destination"("featured");
CREATE INDEX "Destination_displayOrder_idx" ON "Destination"("displayOrder");

CREATE UNIQUE INDEX "TourPackage_slug_key" ON "TourPackage"("slug");
CREATE INDEX "TourPackage_status_idx" ON "TourPackage"("status");
CREATE INDEX "TourPackage_featured_idx" ON "TourPackage"("featured");
CREATE INDEX "TourPackage_displayOrder_idx" ON "TourPackage"("displayOrder");

CREATE INDEX "TripInquiry_email_idx" ON "TripInquiry"("email");
CREATE INDEX "TripInquiry_status_idx" ON "TripInquiry"("status");
CREATE INDEX "TripInquiry_archived_idx" ON "TripInquiry"("archived");
CREATE INDEX "TripInquiry_createdAt_idx" ON "TripInquiry"("createdAt");
CREATE INDEX "TripInquiry_assignedToId_idx" ON "TripInquiry"("assignedToId");

ALTER TABLE "TripInquiry"
ADD CONSTRAINT "TripInquiry_assignedToId_fkey"
FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
