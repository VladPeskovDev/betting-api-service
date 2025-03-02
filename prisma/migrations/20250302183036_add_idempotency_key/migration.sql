/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Bet_idempotencyKey_key" ON "Bet"("idempotencyKey");
