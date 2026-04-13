export type ProductStatus = 'draft' | 'active' | 'archived';

/** Seller CMS product — matches Express `GET/POST /api/products` JSON. */
export interface Product {
  id: string;
  name: string;
  description: string;
  sellingPrice: number;
  costPrice: number;
  unitOfMeasurement: string;
  discountPercent: number | null;
  discountAmount: number | null;
  sku: string | null;
  imageUrls: string[];
  videoUrl: string | null;
  rating: number;
  categoryId: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProductCreatePayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
