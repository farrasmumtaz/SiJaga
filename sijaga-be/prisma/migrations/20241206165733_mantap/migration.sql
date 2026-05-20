/*
  Warnings:

  - You are about to drop the `Sijaga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sijaga" DROP CONSTRAINT "Sijaga_card_id_fkey";

-- DropTable
DROP TABLE "Sijaga";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "UID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("UID")
);

-- CreateTable
CREATE TABLE "sijagas" (
    "id" SERIAL NOT NULL,
    "Timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "card_id" TEXT NOT NULL,

    CONSTRAINT "sijagas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_card_id_key" ON "users"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "sijagas_card_id_key" ON "sijagas"("card_id");

-- AddForeignKey
ALTER TABLE "sijagas" ADD CONSTRAINT "sijagas_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "users"("card_id") ON DELETE RESTRICT ON UPDATE CASCADE;
