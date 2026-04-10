export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  /** Human-readable, e.g. "Red / M" */
  label: string;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  variants: ProductVariant[];
}

export interface CartLine {
  /** Stable id for this row in the cart */
  lineId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderLineSnapshot {
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped';
  lines: OrderLineSnapshot[];
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
}
