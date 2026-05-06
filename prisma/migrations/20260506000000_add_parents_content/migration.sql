CREATE TABLE "ParentsContent" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approaches" JSONB NOT NULL,
    "warningTitle" TEXT NOT NULL,
    "warningDescription" TEXT NOT NULL,
    "warningSignals" TEXT[] NOT NULL,
    "warningFooter" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentsContent_pkey" PRIMARY KEY ("id")
);
