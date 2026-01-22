/*
  Warnings:

  - You are about to drop the column `status` on the `Announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "status";

-- DropEnum
DROP TYPE "AnnouncementStatus";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
