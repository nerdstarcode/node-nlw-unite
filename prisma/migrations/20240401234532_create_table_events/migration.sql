-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "public_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_id_key" ON "events"("id");

-- CreateIndex
CREATE UNIQUE INDEX "events_public_id_key" ON "events"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
