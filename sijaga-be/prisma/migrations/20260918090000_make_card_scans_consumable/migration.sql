DROP INDEX IF EXISTS "card_id_dumps_card_id_key";

ALTER TABLE "card_id_dumps"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "consumed_at" TIMESTAMP(3);

CREATE INDEX "card_id_dumps_created_at_idx"
ON "card_id_dumps"("created_at" DESC);

CREATE INDEX "card_id_dumps_card_id_created_at_idx"
ON "card_id_dumps"("card_id", "created_at" DESC);
