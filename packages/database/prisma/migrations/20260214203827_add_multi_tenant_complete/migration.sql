/*
  Warnings:

  - The values [REPORTED,UNDER_REVIEW,SETTLED] on the enum `AccidentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,SIGNED] on the enum `ContractStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CONTESTED] on the enum `FineStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVED,REJECTED] on the enum `InspectionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PICKUP,RETURN] on the enum `InspectionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [OIL_CHANGE,TIRE_CHANGE,BRAKE_SERVICE,GENERAL_INSPECTION,OTHER] on the enum `MaintenanceType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING] on the enum `RentalStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMPACT,SEDAN,PICKUP] on the enum `VehicleCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `claim_number` on the `accidents` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_cost` on the `accidents` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `accidents` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `accidents` table. All the data in the column will be lost.
  - You are about to drop the column `resource_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `documentType` on the `clients` table. All the data in the column will be lost.
  - You are about to alter the column `state` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - You are about to alter the column `zip_code` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(9)`.
  - You are about to drop the column `file_url` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `signed_by` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `fines` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `fines` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `fines` table. All the data in the column will be lost.
  - You are about to drop the column `paid_date` on the `fines` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `inspection_photos` table. All the data in the column will be lost.
  - You are about to drop the column `fuel_level` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `mileage` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `insurances` table. All the data in the column will be lost.
  - You are about to drop the column `coverage_type` on the `insurances` table. All the data in the column will be lost.
  - You are about to alter the column `policy_number` on the `insurances` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `description` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `paid_date` on the `invoices` table. All the data in the column will be lost.
  - You are about to alter the column `invoice_number` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to drop the column `mileage` on the `maintenances` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `rentals` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `rentals` table. All the data in the column will be lost.
  - You are about to drop the column `finalized_at` on the `rentals` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the `accident_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `damages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[company_id,document]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contract_number]` on the table `contracts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,license_number]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoice_number]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,plate]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,chassis]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `accidents` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_id` on table `audit_logs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `company_id` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `client_id` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_number` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_by_user_id` on table `contracts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by_user_id` on table `contracts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `birth_date` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Made the column `client_id` on table `drivers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `drivers` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `license_category` on the `drivers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `code` to the `fines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `fines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `insurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverage` to the `insurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deductible` to the `insurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `premium` to the `insurances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_by_user_id` on table `invoices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by_user_id` on table `invoices` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `company_id` to the `maintenances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `rentals` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_by_user_id` on table `rentals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by_user_id` on table `rentals` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `token` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ClientDocumentType" AS ENUM ('CPF', 'CNPJ', 'RG', 'PASSPORT');

-- CreateEnum
CREATE TYPE "InvoicePaymentType" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "AccidentStatus_new" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED');
ALTER TABLE "public"."accidents" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "accidents" ALTER COLUMN "status" TYPE "AccidentStatus_new" USING ("status"::text::"AccidentStatus_new");
ALTER TYPE "AccidentStatus" RENAME TO "AccidentStatus_old";
ALTER TYPE "AccidentStatus_new" RENAME TO "AccidentStatus";
DROP TYPE "public"."AccidentStatus_old";
ALTER TABLE "accidents" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ContractStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."contracts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "contracts" ALTER COLUMN "status" TYPE "ContractStatus_new" USING ("status"::text::"ContractStatus_new");
ALTER TYPE "ContractStatus" RENAME TO "ContractStatus_old";
ALTER TYPE "ContractStatus_new" RENAME TO "ContractStatus";
DROP TYPE "public"."ContractStatus_old";
ALTER TABLE "contracts" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "FineStatus_new" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'OVERDUE');
ALTER TABLE "public"."fines" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "fines" ALTER COLUMN "status" TYPE "FineStatus_new" USING ("status"::text::"FineStatus_new");
ALTER TYPE "FineStatus" RENAME TO "FineStatus_old";
ALTER TYPE "FineStatus_new" RENAME TO "FineStatus";
DROP TYPE "public"."FineStatus_old";
ALTER TABLE "fines" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InspectionStatus_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."inspections" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inspections" ALTER COLUMN "status" TYPE "InspectionStatus_new" USING ("status"::text::"InspectionStatus_new");
ALTER TYPE "InspectionStatus" RENAME TO "InspectionStatus_old";
ALTER TYPE "InspectionStatus_new" RENAME TO "InspectionStatus";
DROP TYPE "public"."InspectionStatus_old";
ALTER TABLE "inspections" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InspectionType_new" AS ENUM ('CHECKIN', 'CHECKOUT');
ALTER TABLE "inspections" ALTER COLUMN "type" TYPE "InspectionType_new" USING ("type"::text::"InspectionType_new");
ALTER TYPE "InspectionType" RENAME TO "InspectionType_old";
ALTER TYPE "InspectionType_new" RENAME TO "InspectionType";
DROP TYPE "public"."InspectionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MaintenanceType_new" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'INSPECTION');
ALTER TABLE "maintenances" ALTER COLUMN "type" TYPE "MaintenanceType_new" USING ("type"::text::"MaintenanceType_new");
ALTER TYPE "MaintenanceType" RENAME TO "MaintenanceType_old";
ALTER TYPE "MaintenanceType_new" RENAME TO "MaintenanceType";
DROP TYPE "public"."MaintenanceType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RentalStatus_new" AS ENUM ('RESERVED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."rentals" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "rentals" ALTER COLUMN "status" TYPE "RentalStatus_new" USING ("status"::text::"RentalStatus_new");
ALTER TYPE "RentalStatus" RENAME TO "RentalStatus_old";
ALTER TYPE "RentalStatus_new" RENAME TO "RentalStatus";
DROP TYPE "public"."RentalStatus_old";
ALTER TABLE "rentals" ALTER COLUMN "status" SET DEFAULT 'RESERVED';
COMMIT;

-- AlterEnum
ALTER TYPE "TransmissionType" ADD VALUE 'SEMI_AUTOMATIC';

-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'LOCKED';

-- AlterEnum
BEGIN;
CREATE TYPE "VehicleCategory_new" AS ENUM ('ECONOMIC', 'INTERMEDIATE', 'EXECUTIVE', 'SUV', 'LUXURY', 'VAN');
ALTER TABLE "vehicles" ALTER COLUMN "category" TYPE "VehicleCategory_new" USING ("category"::text::"VehicleCategory_new");
ALTER TYPE "VehicleCategory" RENAME TO "VehicleCategory_old";
ALTER TYPE "VehicleCategory_new" RENAME TO "VehicleCategory";
DROP TYPE "public"."VehicleCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "accident_documents" DROP CONSTRAINT "accident_documents_accident_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_rental_id_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_updated_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "damages" DROP CONSTRAINT "damages_inspection_id_fkey";

-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_client_id_fkey";

-- DropForeignKey
ALTER TABLE "inspections" DROP CONSTRAINT "inspections_rental_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_updated_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_updated_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_invoice_id_fkey";

-- DropIndex
DROP INDEX "accidents_claim_number_key";

-- DropIndex
DROP INDEX "accidents_status_idx";

-- DropIndex
DROP INDEX "accidents_vehicle_id_idx";

-- DropIndex
DROP INDEX "clients_documentType_idx";

-- DropIndex
DROP INDEX "clients_document_idx";

-- DropIndex
DROP INDEX "clients_status_idx";

-- DropIndex
DROP INDEX "contracts_created_by_user_id_idx";

-- DropIndex
DROP INDEX "contracts_rental_id_key";

-- DropIndex
DROP INDEX "contracts_status_idx";

-- DropIndex
DROP INDEX "contracts_updated_by_user_id_idx";

-- DropIndex
DROP INDEX "drivers_client_id_idx";

-- DropIndex
DROP INDEX "drivers_document_idx";

-- DropIndex
DROP INDEX "drivers_document_key";

-- DropIndex
DROP INDEX "drivers_email_idx";

-- DropIndex
DROP INDEX "drivers_license_number_idx";

-- DropIndex
DROP INDEX "drivers_status_idx";

-- DropIndex
DROP INDEX "fines_status_idx";

-- DropIndex
DROP INDEX "fines_vehicle_id_idx";

-- DropIndex
DROP INDEX "insurances_status_idx";

-- DropIndex
DROP INDEX "insurances_vehicle_id_idx";

-- DropIndex
DROP INDEX "invoices_client_id_idx";

-- DropIndex
DROP INDEX "invoices_created_by_user_id_idx";

-- DropIndex
DROP INDEX "invoices_invoice_number_idx";

-- DropIndex
DROP INDEX "invoices_status_idx";

-- DropIndex
DROP INDEX "invoices_updated_by_user_id_idx";

-- DropIndex
DROP INDEX "maintenances_status_idx";

-- DropIndex
DROP INDEX "maintenances_vehicle_id_idx";

-- DropIndex
DROP INDEX "rentals_client_id_idx";

-- DropIndex
DROP INDEX "rentals_created_by_user_id_idx";

-- DropIndex
DROP INDEX "rentals_driver_id_idx";

-- DropIndex
DROP INDEX "rentals_expected_end_date_idx";

-- DropIndex
DROP INDEX "rentals_returned_at_idx";

-- DropIndex
DROP INDEX "rentals_start_date_idx";

-- DropIndex
DROP INDEX "rentals_status_idx";

-- DropIndex
DROP INDEX "rentals_updated_by_user_id_idx";

-- DropIndex
DROP INDEX "rentals_vehicle_id_idx";

-- DropIndex
DROP INDEX "sessions_refresh_token_key";

-- DropIndex
DROP INDEX "users_role_idx";

-- DropIndex
DROP INDEX "users_status_idx";

-- DropIndex
DROP INDEX "vehicles_brand_model_idx";

-- DropIndex
DROP INDEX "vehicles_category_idx";

-- DropIndex
DROP INDEX "vehicles_chassis_idx";

-- DropIndex
DROP INDEX "vehicles_plate_idx";

-- DropIndex
DROP INDEX "vehicles_registration_number_idx";

-- DropIndex
DROP INDEX "vehicles_status_idx";

-- AlterTable
ALTER TABLE "accidents" DROP COLUMN "claim_number",
DROP COLUMN "estimated_cost",
DROP COLUMN "notes",
DROP COLUMN "severity",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "cost" DECIMAL(10,2),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "date" SET DATA TYPE DATE,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "resource_id",
ADD COLUMN     "changes" JSONB,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "documentType",
ADD COLUMN     "birth_date" DATE,
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "document_type" "ClientDocumentType" NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "document" SET DATA TYPE VARCHAR(18),
ALTER COLUMN "state" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "zip_code" SET DATA TYPE VARCHAR(9);

-- AlterTable
ALTER TABLE "contracts" DROP COLUMN "file_url",
DROP COLUMN "signed_by",
ADD COLUMN     "client_id" UUID NOT NULL,
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "contract_number" VARCHAR(20) NOT NULL,
ALTER COLUMN "rental_id" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "created_by_user_id" SET NOT NULL,
ALTER COLUMN "updated_by_user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zip_code",
ADD COLUMN     "birth_date" DATE NOT NULL,
ADD COLUMN     "company_id" UUID NOT NULL,
ALTER COLUMN "client_id" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
DROP COLUMN "license_category",
ADD COLUMN     "license_category" VARCHAR(5) NOT NULL,
ALTER COLUMN "license_expires_at" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "fines" DROP COLUMN "date",
DROP COLUMN "location",
DROP COLUMN "notes",
DROP COLUMN "paid_date",
ADD COLUMN     "code" VARCHAR(20) NOT NULL,
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "paid_at" TIMESTAMP(3),
ALTER COLUMN "due_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "inspection_photos" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "inspections" DROP COLUMN "fuel_level",
DROP COLUMN "mileage",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "scheduled_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "insurances" DROP COLUMN "amount",
DROP COLUMN "coverage_type",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "coverage" TEXT NOT NULL,
ADD COLUMN     "deductible" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "premium" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "policy_number" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "description",
DROP COLUMN "notes",
DROP COLUMN "paid_date",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "paid_at" TIMESTAMP(3),
ALTER COLUMN "invoice_number" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "due_date" SET DATA TYPE DATE,
ALTER COLUMN "created_by_user_id" SET NOT NULL,
ALTER COLUMN "updated_by_user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "maintenances" DROP COLUMN "mileage",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "scheduled_date" SET DATA TYPE DATE,
ALTER COLUMN "completed_date" SET DATA TYPE DATE,
ALTER COLUMN "cost" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rentals" DROP COLUMN "deposit",
DROP COLUMN "discount",
DROP COLUMN "finalized_at",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "final_mileage" INTEGER,
ADD COLUMN     "initial_mileage" INTEGER,
ADD COLUMN     "pickup_location" TEXT,
ADD COLUMN     "return_location" TEXT,
ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "expected_end_date" SET DATA TYPE DATE,
ALTER COLUMN "status" SET DEFAULT 'RESERVED',
ALTER COLUMN "created_by_user_id" SET NOT NULL,
ALTER COLUMN "updated_by_user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "ip_address",
DROP COLUMN "refresh_token",
DROP COLUMN "user_agent",
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "company_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "company_id" UUID NOT NULL;

-- DropTable
DROP TABLE "accident_documents";

-- DropTable
DROP TABLE "damages";

-- DropTable
DROP TABLE "settings";

-- DropTable
DROP TABLE "transactions";

-- DropEnum
DROP TYPE "AccidentSeverity";

-- DropEnum
DROP TYPE "DocumentType";

-- DropEnum
DROP TYPE "LicenseCategory";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "TransactionStatus";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "document" VARCHAR(18) NOT NULL,
    "trade_name" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "email" VARCHAR(320),
    "phone" VARCHAR(20),
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_damages" (
    "id" UUID NOT NULL,
    "inspection_id" UUID NOT NULL,
    "location" TEXT NOT NULL,
    "severity" "DamageSeverity" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "inspection_damages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accident_photos" (
    "id" UUID NOT NULL,
    "accident_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "accident_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_payments" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "InvoicePaymentType" NOT NULL,
    "date" DATE NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" VARCHAR(100),

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_document_key" ON "companies"("document");

-- CreateIndex
CREATE INDEX "companies_document_idx" ON "companies"("document");

-- CreateIndex
CREATE INDEX "companies_status_idx" ON "companies"("status");

-- CreateIndex
CREATE INDEX "companies_deleted_at_idx" ON "companies"("deleted_at");

-- CreateIndex
CREATE INDEX "inspection_damages_inspection_id_idx" ON "inspection_damages"("inspection_id");

-- CreateIndex
CREATE INDEX "inspection_damages_severity_idx" ON "inspection_damages"("severity");

-- CreateIndex
CREATE INDEX "accident_photos_accident_id_idx" ON "accident_photos"("accident_id");

-- CreateIndex
CREATE INDEX "invoice_payments_invoice_id_idx" ON "invoice_payments"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_payments_type_idx" ON "invoice_payments"("type");

-- CreateIndex
CREATE INDEX "invoice_payments_date_idx" ON "invoice_payments"("date");

-- CreateIndex
CREATE INDEX "invoice_payments_status_idx" ON "invoice_payments"("status");

-- CreateIndex
CREATE INDEX "accidents_company_id_idx" ON "accidents"("company_id");

-- CreateIndex
CREATE INDEX "accidents_company_id_vehicle_id_idx" ON "accidents"("company_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "accidents_company_id_status_idx" ON "accidents"("company_id", "status");

-- CreateIndex
CREATE INDEX "clients_company_id_idx" ON "clients"("company_id");

-- CreateIndex
CREATE INDEX "clients_company_id_document_idx" ON "clients"("company_id", "document");

-- CreateIndex
CREATE INDEX "clients_company_id_status_idx" ON "clients"("company_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "clients_company_id_document_key" ON "clients"("company_id", "document");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_number_key" ON "contracts"("contract_number");

-- CreateIndex
CREATE INDEX "contracts_company_id_idx" ON "contracts"("company_id");

-- CreateIndex
CREATE INDEX "contracts_company_id_contract_number_idx" ON "contracts"("company_id", "contract_number");

-- CreateIndex
CREATE INDEX "contracts_company_id_client_id_idx" ON "contracts"("company_id", "client_id");

-- CreateIndex
CREATE INDEX "contracts_company_id_status_idx" ON "contracts"("company_id", "status");

-- CreateIndex
CREATE INDEX "drivers_company_id_idx" ON "drivers"("company_id");

-- CreateIndex
CREATE INDEX "drivers_company_id_client_id_idx" ON "drivers"("company_id", "client_id");

-- CreateIndex
CREATE INDEX "drivers_company_id_license_number_idx" ON "drivers"("company_id", "license_number");

-- CreateIndex
CREATE INDEX "drivers_company_id_status_idx" ON "drivers"("company_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_company_id_license_number_key" ON "drivers"("company_id", "license_number");

-- CreateIndex
CREATE INDEX "fines_company_id_idx" ON "fines"("company_id");

-- CreateIndex
CREATE INDEX "fines_company_id_vehicle_id_idx" ON "fines"("company_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "fines_company_id_status_idx" ON "fines"("company_id", "status");

-- CreateIndex
CREATE INDEX "insurances_company_id_idx" ON "insurances"("company_id");

-- CreateIndex
CREATE INDEX "insurances_company_id_vehicle_id_idx" ON "insurances"("company_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "insurances_company_id_status_idx" ON "insurances"("company_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_company_id_idx" ON "invoices"("company_id");

-- CreateIndex
CREATE INDEX "invoices_company_id_invoice_number_idx" ON "invoices"("company_id", "invoice_number");

-- CreateIndex
CREATE INDEX "invoices_company_id_client_id_idx" ON "invoices"("company_id", "client_id");

-- CreateIndex
CREATE INDEX "invoices_company_id_status_idx" ON "invoices"("company_id", "status");

-- CreateIndex
CREATE INDEX "maintenances_company_id_idx" ON "maintenances"("company_id");

-- CreateIndex
CREATE INDEX "maintenances_company_id_vehicle_id_idx" ON "maintenances"("company_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "maintenances_company_id_status_idx" ON "maintenances"("company_id", "status");

-- CreateIndex
CREATE INDEX "rentals_company_id_idx" ON "rentals"("company_id");

-- CreateIndex
CREATE INDEX "rentals_company_id_client_id_idx" ON "rentals"("company_id", "client_id");

-- CreateIndex
CREATE INDEX "rentals_company_id_driver_id_idx" ON "rentals"("company_id", "driver_id");

-- CreateIndex
CREATE INDEX "rentals_company_id_vehicle_id_idx" ON "rentals"("company_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "rentals_company_id_status_idx" ON "rentals"("company_id", "status");

-- CreateIndex
CREATE INDEX "rentals_company_id_start_date_idx" ON "rentals"("company_id", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "users_company_id_idx" ON "users"("company_id");

-- CreateIndex
CREATE INDEX "users_company_id_role_idx" ON "users"("company_id", "role");

-- CreateIndex
CREATE INDEX "users_company_id_status_idx" ON "users"("company_id", "status");

-- CreateIndex
CREATE INDEX "vehicles_company_id_idx" ON "vehicles"("company_id");

-- CreateIndex
CREATE INDEX "vehicles_company_id_status_idx" ON "vehicles"("company_id", "status");

-- CreateIndex
CREATE INDEX "vehicles_company_id_category_idx" ON "vehicles"("company_id", "category");

-- CreateIndex
CREATE INDEX "vehicles_company_id_plate_idx" ON "vehicles"("company_id", "plate");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_company_id_plate_key" ON "vehicles"("company_id", "plate");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_company_id_chassis_key" ON "vehicles"("company_id", "chassis");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rentals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_damages" ADD CONSTRAINT "inspection_damages_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accidents" ADD CONSTRAINT "accidents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accident_photos" ADD CONSTRAINT "accident_photos_accident_id_fkey" FOREIGN KEY ("accident_id") REFERENCES "accidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fines" ADD CONSTRAINT "fines_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rentals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
