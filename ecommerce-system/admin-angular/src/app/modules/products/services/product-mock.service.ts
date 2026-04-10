import { Injectable, signal } from '@angular/core';

import type { Product } from '../../../shared/models/product.model';
import { buildVariantAttributeMaps, variantSignature } from '../../../shared/utils/variant-combinations';

function seedProducts(): Product[] {
  const attrDefs = [
    { name: 'Color', values: ['Red', 'Blue'] },
    { name: 'Size', values: ['S', 'M'] },
  ];
  const maps = buildVariantAttributeMaps(attrDefs);
  const variants = maps.map((attrs, i) => ({
    id: `v-seed-${i}`,
    signature: variantSignature(attrs),
    sku: `DEMO-TSHIRT-${i + 1}`,
    price: 29.99 + i,
    stock: 10 + i,
    weight: 0.25 + i * 0.01,
    status: 'active' as const,
    attributes: attrs,
  }));

  return [
    {
      id: 'p-seed-1',
      name: 'Demo T‑Shirt',
      description: 'Example product with Color × Size variants.',
      categoryId: 'cat-apparel',
      status: 'active',
      imageUrls: ['https://placehold.co/120x120/png?text=Product'],
      attributeDefinitions: attrDefs,
      variants,
    },
    {
      id: 'p-seed-2',
      name: 'USB Cable',
      description: 'Single-SKU product (no attributes).',
      categoryId: 'cat-electronics',
      status: 'draft',
      imageUrls: [],
      attributeDefinitions: [],
      variants: [
        {
          id: 'v-seed-single',
          signature: '',
          sku: 'USB-C-001',
          price: 12.5,
          stock: 100,
          weight: 0.05,
          status: 'active',
          attributes: {},
        },
      ],
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class ProductMockService {
  private readonly products = signal<Product[]>(seedProducts());

  readonly all = this.products.asReadonly();

  getById(id: string): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  create(product: Omit<Product, 'id'>): Product {
    const next: Product = { ...product, id: crypto.randomUUID() };
    this.products.update((list) => [...list, next]);
    return next;
  }

  update(id: string, patch: Product): void {
    this.products.update((list) => list.map((p) => (p.id === id ? patch : p)));
  }

  delete(id: string): void {
    this.products.update((list) => list.filter((p) => p.id !== id));
  }
}
