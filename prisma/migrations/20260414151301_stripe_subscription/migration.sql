-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('BASE', 'PRO', 'BUSINESS');

-- CreateEnum
CREATE TYPE "SubscriptionState" AS ENUM ('ACTIVE', 'INACTIVE', 'REVOKED', 'EXPIRED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "stripe_customer_id" TEXT;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "onTrial" BOOLEAN NOT NULL DEFAULT true,
    "trialEndsOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
