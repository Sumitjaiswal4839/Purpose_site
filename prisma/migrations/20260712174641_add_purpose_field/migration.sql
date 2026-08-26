-- CreateTable
CREATE TABLE "SecretLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "linkToken" TEXT,
    "partnerName" TEXT NOT NULL,
    "yourName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "question" TEXT NOT NULL DEFAULT 'Will you marry me?',
    "purpose" TEXT,
    "templateType" TEXT NOT NULL DEFAULT 'default',
    "mediaUrls" JSONB NOT NULL DEFAULT [],
    "musicTrack" TEXT,
    "effectType" TEXT,
    "filterType" TEXT,
    "fontStyle" TEXT,
    "maxViews" INTEGER NOT NULL DEFAULT 2,
    "currentViews" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentAmount" REAL,
    "planType" TEXT,
    "userEmail" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "verificationToken" TEXT,
    "verificationHash" TEXT,
    "verifiedAt" DATETIME,
    "verifiedBy" TEXT,
    "tokenExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "secretLinkId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "viewNumber" INTEGER NOT NULL,
    "accessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessLog_secretLinkId_fkey" FOREIGN KEY ("secretLinkId") REFERENCES "SecretLink" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "requestType" TEXT NOT NULL DEFAULT 'order',
    "description" TEXT NOT NULL,
    "referenceImages" JSONB NOT NULL DEFAULT [],
    "budget" REAL,
    "deadline" DATETIME,
    "rating" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TemplateConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "thumbnailUrl" TEXT,
    "previewUrl" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SecretLink_token_key" ON "SecretLink"("token");

-- CreateIndex
CREATE UNIQUE INDEX "SecretLink_linkToken_key" ON "SecretLink"("linkToken");

-- CreateIndex
CREATE UNIQUE INDEX "SecretLink_transactionId_key" ON "SecretLink"("transactionId");

-- CreateIndex
CREATE INDEX "SecretLink_token_idx" ON "SecretLink"("token");

-- CreateIndex
CREATE INDEX "SecretLink_transactionId_idx" ON "SecretLink"("transactionId");

-- CreateIndex
CREATE INDEX "SecretLink_userEmail_idx" ON "SecretLink"("userEmail");

-- CreateIndex
CREATE INDEX "SecretLink_isActive_idx" ON "SecretLink"("isActive");

-- CreateIndex
CREATE INDEX "SecretLink_expiresAt_idx" ON "SecretLink"("expiresAt");

-- CreateIndex
CREATE INDEX "AccessLog_secretLinkId_idx" ON "AccessLog"("secretLinkId");

-- CreateIndex
CREATE INDEX "CustomRequest_status_idx" ON "CustomRequest"("status");

-- CreateIndex
CREATE INDEX "CustomRequest_customerEmail_idx" ON "CustomRequest"("customerEmail");

-- CreateIndex
CREATE INDEX "CustomRequest_requestType_idx" ON "CustomRequest"("requestType");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateConfig_templateId_key" ON "TemplateConfig"("templateId");
