CREATE TABLE "Advantage" (
    "advantageID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Advantage_pkey" PRIMARY KEY ("advantageID")
);

CREATE UNIQUE INDEX "Advantage_name_key" ON "Advantage"("name");

ALTER TABLE "Player"
ADD COLUMN "advantages" JSONB NOT NULL DEFAULT '[]';
