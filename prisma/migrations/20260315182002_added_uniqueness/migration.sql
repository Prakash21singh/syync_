/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `adapter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "adapter" ADD COLUMN     "providerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "adapter_providerId_key" ON "adapter"("providerId");
