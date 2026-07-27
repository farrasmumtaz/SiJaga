/*
  Warnings:

  - You are about to drop the column `token` on the `locked_status` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "locked_status" DROP COLUMN "token";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
