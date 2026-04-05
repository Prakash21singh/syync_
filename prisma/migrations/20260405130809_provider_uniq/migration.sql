/*
  Warnings:

  - A unique constraint covering the columns `[userId,providerId]` on the table `adapter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "adapter_providerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "adapter_userId_providerId_key" ON "adapter"("userId", "providerId");
