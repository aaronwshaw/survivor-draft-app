-- AlterTable
ALTER TABLE "DraftState"
ADD COLUMN "tribes" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "tribeByPlayerId" JSONB NOT NULL DEFAULT '{}';
