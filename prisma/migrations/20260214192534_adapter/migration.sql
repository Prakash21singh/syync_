-- CreateEnum
CREATE TYPE "AdapterName" AS ENUM ('GOOGLE_DRIVE', 'DROPBOX');

-- CreateTable
CREATE TABLE "adapter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "token_type" TEXT,
    "adapter_type" "AdapterName" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "adapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adapter_name_key" ON "adapter"("name");

-- AddForeignKey
ALTER TABLE "adapter" ADD CONSTRAINT "adapter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
