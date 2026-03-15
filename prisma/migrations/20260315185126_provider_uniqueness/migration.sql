/*
  Warnings:

  - Made the column `providerId` on table `adapter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "adapter" ALTER COLUMN "providerId" SET NOT NULL;
