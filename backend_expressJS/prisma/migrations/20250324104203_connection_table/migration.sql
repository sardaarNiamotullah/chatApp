-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DELETED');

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "userAUsername" TEXT NOT NULL,
    "userBUsername" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_userAUsername_userBUsername_key" ON "Connection"("userAUsername", "userBUsername");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userAUsername_fkey" FOREIGN KEY ("userAUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userBUsername_fkey" FOREIGN KEY ("userBUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
