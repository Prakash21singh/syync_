/*
  Warnings:

  - You are about to drop the column `pathname` on the `MigrationSelection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MigrationSelection" DROP COLUMN "pathname",
ADD COLUMN     "path" TEXT;
