-- AlterTable
ALTER TABLE "adapter" ADD COLUMN     "accessKeyId" TEXT,
ADD COLUMN     "accessKeySecret" TEXT,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "adapter_account_info" ADD COLUMN     "arn" TEXT;
