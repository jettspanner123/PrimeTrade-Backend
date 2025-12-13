-- CreateEnum
CREATE TYPE "DeletionStatus" AS ENUM ('NOT_DELETED', 'SOFT_DELETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletionStatus" "DeletionStatus" NOT NULL DEFAULT 'NOT_DELETED';
