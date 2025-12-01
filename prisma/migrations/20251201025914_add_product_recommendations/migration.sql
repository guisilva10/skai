-- CreateTable
CREATE TABLE "ProductRecommendation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "searchTerms" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseUrl" (
    "id" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductRecommendation_userId_idx" ON "ProductRecommendation"("userId");

-- AddForeignKey
ALTER TABLE "ProductRecommendation" ADD CONSTRAINT "ProductRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseUrl" ADD CONSTRAINT "PurchaseUrl_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "ProductRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
