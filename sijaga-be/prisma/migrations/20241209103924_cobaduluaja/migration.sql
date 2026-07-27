/*
  Warnings:

  - You are about to drop the `locked_status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "usage_history_card_id_key";

-- DropTable
DROP TABLE "locked_status";

-- CreateTable
CREATE TABLE "blacklisted_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklisted_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklisted_tokens_token_key" ON "blacklisted_tokens"("token");
