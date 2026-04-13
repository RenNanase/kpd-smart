/** JSON shape returned to the admin app (camelCase). */
export interface ProductDto {
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
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  sellingPrice: number;
  costPrice?: number;
  unitOfMeasurement?: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  sku?: string | null;
  imageUrls?: string[];
  videoUrl?: string | null;
  rating?: number;
  categoryId?: string | null;
  status?: 'draft' | 'active' | 'archived';
}
