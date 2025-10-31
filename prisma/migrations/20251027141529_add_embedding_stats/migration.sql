-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "tokensCount" INTEGER DEFAULT 0,
ADD COLUMN     "vectorsCount" INTEGER DEFAULT 0;
