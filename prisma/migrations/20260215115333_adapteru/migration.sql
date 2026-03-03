-- CreateTable
CREATE TABLE "adapter_account_info" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adapterId" TEXT NOT NULL,

    CONSTRAINT "adapter_account_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adapter_account_info_adapterId_key" ON "adapter_account_info"("adapterId");

-- CreateIndex
CREATE INDEX "adapter_account_info_adapterId_idx" ON "adapter_account_info"("adapterId");

-- AddForeignKey
ALTER TABLE "adapter_account_info" ADD CONSTRAINT "adapter_account_info_adapterId_fkey" FOREIGN KEY ("adapterId") REFERENCES "adapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
