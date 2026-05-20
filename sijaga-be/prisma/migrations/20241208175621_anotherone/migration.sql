/*
  Warnings:

  - Added the required column `token` to the `locked_status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locked_status" ADD COLUMN     "token" TEXT NOT NULL;
