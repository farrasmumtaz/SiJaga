CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';
ALTER TABLE "usage_history" ADD COLUMN "user_id" INTEGER;
UPDATE "usage_history" h SET "user_id" = u.id FROM "users" u WHERE h.card_id = u.card_id;
ALTER TABLE "usage_history" ADD CONSTRAINT "usage_history_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "usage_history_user_id_Timestamp_id_idx" ON "usage_history"("user_id", "Timestamp" DESC, "id" DESC);
-- History is served by the backend using application JWTs, not public REST roles.
REVOKE ALL ON TABLE "usage_history" FROM anon, authenticated;
ALTER TABLE "usage_history" ENABLE ROW LEVEL SECURITY;
