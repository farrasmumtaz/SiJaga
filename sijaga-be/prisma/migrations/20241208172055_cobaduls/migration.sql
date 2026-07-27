/*
  Warnings:

  - Added the required column `token` to the `locked_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locked_status" ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL;
