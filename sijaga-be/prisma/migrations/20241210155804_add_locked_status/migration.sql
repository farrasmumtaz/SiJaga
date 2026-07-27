-- CreateTable
CREATE TABLE "locked_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "Timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locked_status_pkey" PRIMARY KEY ("id")
);
