-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "taxRateBps" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isTaxable" BOOLEAN NOT NULL DEFAULT true;
