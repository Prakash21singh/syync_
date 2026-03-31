/*
  Warnings:

  - You are about to drop the column `bucket` on the `adapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Migration" ADD COLUMN     "bucket" TEXT;

-- AlterTable
ALTER TABLE "adapter" DROP COLUMN "bucket";
