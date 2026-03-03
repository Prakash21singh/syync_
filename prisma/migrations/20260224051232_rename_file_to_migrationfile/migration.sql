/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_migrationId_fkey";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "MigrationFile" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "source" "AdapterName" NOT NULL,
    "destination" "AdapterName" NOT NULL,
    "status" "MigrationStatus" NOT NULL,
    "migrationId" TEXT NOT NULL,

    CONSTRAINT "MigrationFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MigrationFile" ADD CONSTRAINT "MigrationFile_migrationId_fkey" FOREIGN KEY ("migrationId") REFERENCES "Migration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
