/*
  Warnings:

  - You are about to drop the column `files` on the `Migration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Migration" DROP COLUMN "files";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "source" "AdapterName" NOT NULL,
    "destination" "AdapterName" NOT NULL,
    "status" "MigrationStatus" NOT NULL,
    "migrationId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_migrationId_fkey" FOREIGN KEY ("migrationId") REFERENCES "Migration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
