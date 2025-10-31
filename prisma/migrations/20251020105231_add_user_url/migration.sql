/*
  Warnings:

  - A unique constraint covering the columns `[userUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_userUrl_key" ON "User"("userUrl");
