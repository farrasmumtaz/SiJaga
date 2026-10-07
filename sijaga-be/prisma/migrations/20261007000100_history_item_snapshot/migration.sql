-- Historical rows retain NULL. Existing ordering indexes are sufficient.
ALTER TABLE "usage_history" ADD COLUMN IF NOT EXISTS "avail_status" TEXT;
