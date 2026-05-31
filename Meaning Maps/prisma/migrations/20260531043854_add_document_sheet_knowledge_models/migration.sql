-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCollaborator" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetCollaborator" (
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SheetCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeDoc" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "persona" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileBlobKey" TEXT NOT NULL,
    "coverUrl" TEXT,
    "coverBlobKey" TEXT,
    "fileSize" INTEGER NOT NULL,
    "totalSegments" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeSegment" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "segmentIndex" INTEGER NOT NULL,
    "pageNumber" INTEGER,
    "wordCount" INTEGER NOT NULL,

    CONSTRAINT "KnowledgeSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_ownerId_idx" ON "Document"("ownerId");

-- CreateIndex
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");

-- CreateIndex
CREATE INDEX "DocumentCollaborator_email_idx" ON "DocumentCollaborator"("email");

-- CreateIndex
CREATE INDEX "DocumentCollaborator_documentId_createdAt_idx" ON "DocumentCollaborator"("documentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCollaborator_documentId_email_key" ON "DocumentCollaborator"("documentId", "email");

-- CreateIndex
CREATE INDEX "Sheet_ownerId_idx" ON "Sheet"("ownerId");

-- CreateIndex
CREATE INDEX "Sheet_createdAt_idx" ON "Sheet"("createdAt");

-- CreateIndex
CREATE INDEX "SheetCollaborator_email_idx" ON "SheetCollaborator"("email");

-- CreateIndex
CREATE INDEX "SheetCollaborator_sheetId_createdAt_idx" ON "SheetCollaborator"("sheetId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SheetCollaborator_sheetId_email_key" ON "SheetCollaborator"("sheetId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeDoc_slug_key" ON "KnowledgeDoc"("slug");

-- CreateIndex
CREATE INDEX "KnowledgeDoc_ownerId_idx" ON "KnowledgeDoc"("ownerId");

-- CreateIndex
CREATE INDEX "KnowledgeDoc_createdAt_idx" ON "KnowledgeDoc"("createdAt");

-- CreateIndex
CREATE INDEX "KnowledgeSegment_docId_idx" ON "KnowledgeSegment"("docId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeSegment_docId_segmentIndex_key" ON "KnowledgeSegment"("docId", "segmentIndex");

-- AddForeignKey
ALTER TABLE "DocumentCollaborator" ADD CONSTRAINT "DocumentCollaborator_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetCollaborator" ADD CONSTRAINT "SheetCollaborator_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeSegment" ADD CONSTRAINT "KnowledgeSegment_docId_fkey" FOREIGN KEY ("docId") REFERENCES "KnowledgeDoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
