/*
  Warnings:

  - You are about to drop the column `expires_at` on the `adapter` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token_expires_at` on the `adapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "adapter" DROP COLUMN "expires_at",
DROP COLUMN "refresh_token_expires_at",
ADD COLUMN     "expires_in" TIMESTAMP(3),
ADD COLUMN     "refresh_token_expires_in" TIMESTAMP(3);
