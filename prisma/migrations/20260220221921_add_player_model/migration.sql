-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "age" INTEGER,
    "tribe" TEXT,
    "seasons" JSONB NOT NULL DEFAULT '[]',
    "seasonCount" INTEGER NOT NULL DEFAULT 0,
    "winnerCount" INTEGER NOT NULL DEFAULT 0,
    "finalistCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
