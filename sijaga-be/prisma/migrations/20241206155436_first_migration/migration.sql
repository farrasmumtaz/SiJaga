-- CreateTable
CREATE TABLE "User" (
    "UID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UID")
);

-- CreateTable
CREATE TABLE "Sijaga" (
    "id" SERIAL NOT NULL,
    "Timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Sijaga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Sijaga" ADD CONSTRAINT "Sijaga_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("UID") ON DELETE RESTRICT ON UPDATE CASCADE;
