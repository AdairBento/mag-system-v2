-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LicenseCategory" ADD VALUE 'AC';
ALTER TYPE "LicenseCategory" ADD VALUE 'AD';
ALTER TYPE "LicenseCategory" ADD VALUE 'AE';

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "client_id" UUID;

-- CreateIndex
CREATE INDEX "drivers_client_id_idx" ON "drivers"("client_id");

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
