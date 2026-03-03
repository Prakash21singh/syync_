-- CreateEnum
CREATE TYPE "MigrationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'RETRY');

-- CreateTable
CREATE TABLE "Migration" (
    "id" TEXT NOT NULL,
    "status" "MigrationStatus" NOT NULL,
    "sourceAdapterId" TEXT NOT NULL,
    "destinationAdapterId" TEXT NOT NULL,
    "files" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Migration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Migration" ADD CONSTRAINT "Migration_sourceAdapterId_fkey" FOREIGN KEY ("sourceAdapterId") REFERENCES "adapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Migration" ADD CONSTRAINT "Migration_destinationAdapterId_fkey" FOREIGN KEY ("destinationAdapterId") REFERENCES "adapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Migration" ADD CONSTRAINT "Migration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
