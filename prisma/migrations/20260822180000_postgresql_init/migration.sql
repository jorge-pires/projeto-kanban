-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "passwordHash" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "description" VARCHAR(240),
    "color" VARCHAR(20) NOT NULL DEFAULT 'blue',
    "ownerId" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Project_color_check" CHECK ("color" IN ('blue', 'emerald', 'violet', 'amber', 'rose'))
);

-- CreateTable
CREATE TABLE "Task" (
    "id" VARCHAR(30) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL DEFAULT '',
    "status" VARCHAR(20) NOT NULL DEFAULT 'todo',
    "priority" VARCHAR(10) NOT NULL DEFAULT 'medium',
    "position" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "projectId" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Task_status_check" CHECK ("status" IN ('todo', 'in-progress', 'done')),
    CONSTRAINT "Task_priority_check" CHECK ("priority" IN ('low', 'medium', 'high')),
    CONSTRAINT "Task_position_check" CHECK ("position" >= 0)
);

-- CreateTable
CREATE TABLE "AuthAttempt" (
    "id" VARCHAR(30) NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "identifierHash" CHAR(64) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthAttempt_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuthAttempt_attempts_check" CHECK ("attempts" > 0),
    CONSTRAINT "AuthAttempt_action_check" CHECK ("action" IN ('login', 'register'))
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");
CREATE INDEX "Project_ownerId_updatedAt_idx" ON "Project"("ownerId", "updatedAt");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Task_projectId_status_position_idx" ON "Task"("projectId", "status", "position");
CREATE UNIQUE INDEX "AuthAttempt_action_identifierHash_key" ON "AuthAttempt"("action", "identifierHash");
CREATE INDEX "AuthAttempt_resetAt_idx" ON "AuthAttempt"("resetAt");
CREATE INDEX "AuthAttempt_userId_idx" ON "AuthAttempt"("userId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuthAttempt" ADD CONSTRAINT "AuthAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
