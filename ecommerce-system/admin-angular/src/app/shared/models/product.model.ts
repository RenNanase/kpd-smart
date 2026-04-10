export type ProductStatus = 'draft' | 'active' | 'archived';

export type VariantStatus = 'active' | 'inactive';

/** e.g. Color with values Red, Blue */
export interface ProductAttributeDefinition {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  /** Stable key from sorted attribute pairs (for merge on regeneration). */
  signature: string;
  sku: string;
  price: number;
  stock: number;
  weight: number;
  status: VariantStatus;
  /** Attribute name → value for this combination (e.g. Color → Red). */
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  status: ProductStatus;
  imageUrls: string[];
  attributeDefinitions: ProductAttributeDefinition[];
  variants: ProductVariant[];
}
