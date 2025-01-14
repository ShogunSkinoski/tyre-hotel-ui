-- CreateTable
CREATE TABLE "StorageCapacity" (
    "location" TEXT NOT NULL PRIMARY KEY,
    "capacity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
