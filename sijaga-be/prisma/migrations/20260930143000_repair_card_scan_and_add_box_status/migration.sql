DROP INDEX IF EXISTS "card_id_dumps_card_id_key";

ALTER TABLE "card_id_dumps"
ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "consumed_at" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "card_id_dumps_created_at_idx"
ON "card_id_dumps"("created_at" DESC);

CREATE INDEX IF NOT EXISTS "card_id_dumps_card_id_created_at_idx"
ON "card_id_dumps"("card_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "locked_status_Timestamp_id_idx"
ON "locked_status"("Timestamp" DESC, "id" DESC);

CREATE TABLE IF NOT EXISTS "box_status" (
  "id" SERIAL NOT NULL,
  "status" TEXT NOT NULL,
  "distance_cm" INTEGER,
  "Timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "box_status_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "box_status_Timestamp_id_idx"
ON "box_status"("Timestamp" DESC, "id" DESC);

ALTER TABLE "box_status" ENABLE ROW LEVEL SECURITY;
