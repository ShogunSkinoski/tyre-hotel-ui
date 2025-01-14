/*
  Warnings:

  - Added the required column `brand` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Car" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT NOT NULL
);
INSERT INTO "new_Car" ("createdAt", "customerEmail", "customerName", "customerPhone", "id", "plate") SELECT "createdAt", "customerEmail", "customerName", "customerPhone", "id", "plate" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
CREATE UNIQUE INDEX "Car_plate_key" ON "Car"("plate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
