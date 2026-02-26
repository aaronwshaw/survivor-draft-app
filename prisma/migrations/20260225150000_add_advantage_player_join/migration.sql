CREATE TABLE "AdvantagePlayer" (
    "advantageID" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdvantagePlayer_pkey" PRIMARY KEY ("advantageID","playerId")
);

CREATE INDEX "AdvantagePlayer_playerId_idx" ON "AdvantagePlayer"("playerId");

ALTER TABLE "AdvantagePlayer"
ADD CONSTRAINT "AdvantagePlayer_advantageID_fkey"
FOREIGN KEY ("advantageID") REFERENCES "Advantage"("advantageID") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AdvantagePlayer"
ADD CONSTRAINT "AdvantagePlayer_playerId_fkey"
FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "AdvantagePlayer" ("advantageID", "playerId")
SELECT DISTINCT value::text AS "advantageID", p."id" AS "playerId"
FROM "Player" p,
LATERAL jsonb_array_elements_text(COALESCE(p."advantages", '[]'::jsonb)) AS value
WHERE value IS NOT NULL AND value <> '';

ALTER TABLE "Player" DROP COLUMN "advantages";
