/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UID` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `sijagas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sijagas" DROP CONSTRAINT "sijagas_card_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "UID",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "sijagas";

-- CreateTable
CREATE TABLE "usage_history" (
    "id" SERIAL NOT NULL,
    "Timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,

    CONSTRAINT "usage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_id_dumps" (
    "id" SERIAL NOT NULL,
    "card_id" TEXT NOT NULL,

    CONSTRAINT "card_id_dumps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locked_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "locked_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usage_history_card_id_key" ON "usage_history"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "card_id_dumps_card_id_key" ON "card_id_dumps"("card_id");
