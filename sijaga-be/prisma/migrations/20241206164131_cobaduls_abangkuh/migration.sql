/*
  Warnings:

  - You are about to drop the column `user_id` on the `Sijaga` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[card_id]` on the table `Sijaga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[card_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `card_id` to the `Sijaga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sijaga" DROP CONSTRAINT "Sijaga_user_id_fkey";

-- AlterTable
ALTER TABLE "Sijaga" DROP COLUMN "user_id",
ADD COLUMN     "card_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "card_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sijaga_card_id_key" ON "Sijaga"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_card_id_key" ON "User"("card_id");

-- AddForeignKey
ALTER TABLE "Sijaga" ADD CONSTRAINT "Sijaga_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "User"("card_id") ON DELETE RESTRICT ON UPDATE CASCADE;
