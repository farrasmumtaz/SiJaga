/*
  Warnings:

  - A unique constraint covering the columns `[card_id]` on the table `sijagas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sijagas_card_id_key" ON "sijagas"("card_id");
