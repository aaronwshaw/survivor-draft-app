ALTER TABLE "AdvantagePlayer" DROP CONSTRAINT "AdvantagePlayer_pkey";

ALTER TABLE "AdvantagePlayer" ADD COLUMN "id" TEXT;

UPDATE "AdvantagePlayer"
SET "id" = 'ap_' || SUBSTRING(MD5("advantageID" || ':' || "playerId" || ':' || "createdAt"::text) FROM 1 FOR 24)
WHERE "id" IS NULL;

ALTER TABLE "AdvantagePlayer" ALTER COLUMN "id" SET NOT NULL;

ALTER TABLE "AdvantagePlayer" ADD CONSTRAINT "AdvantagePlayer_pkey" PRIMARY KEY ("id");

CREATE INDEX "AdvantagePlayer_advantageID_playerId_idx" ON "AdvantagePlayer"("advantageID", "playerId");
