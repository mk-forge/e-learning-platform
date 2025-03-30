/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `courses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,course_id]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "imageUrl";

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");
