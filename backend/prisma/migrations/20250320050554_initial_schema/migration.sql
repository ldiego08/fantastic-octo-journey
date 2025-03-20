-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
