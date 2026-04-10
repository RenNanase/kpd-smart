import type { Product } from '../types/shop.types';

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Classic Tee',
    description:
      'Soft cotton tee. Pick your color and size — inventory is mocked for the storefront demo.',
    imageUrl: 'https://placehold.co/640x640/png?text=Classic+Tee',
    categoryId: 'cat-apparel',
    variants: [
      {
        id: 'p-1-v1',
        sku: 'TEE-RED-S',
        price: 29.99,
        stock: 12,
        label: 'Red / S',
        attributes: { Color: 'Red', Size: 'S' },
      },
      {
        id: 'p-1-v2',
        sku: 'TEE-RED-M',
        price: 29.99,
        stock: 8,
        label: 'Red / M',
        attributes: { Color: 'Red', Size: 'M' },
      },
      {
        id: 'p-1-v3',
        sku: 'TEE-BLUE-M',
        price: 29.99,
        stock: 15,
        label: 'Blue / M',
        attributes: { Color: 'Blue', Size: 'M' },
      },
    ],
  },
  {
    id: 'p-2',
    name: 'USB-C Cable',
    description: 'Durable braided cable for laptops and phones.',
    imageUrl: 'https://placehold.co/640x640/png?text=USB-C',
    categoryId: 'cat-electronics',
    variants: [
      {
        id: 'p-2-v1',
        sku: 'USB-1M',
        price: 14.5,
        stock: 40,
        label: '1 m',
        attributes: { Length: '1 m' },
      },
      {
        id: 'p-2-v2',
        sku: 'USB-2M',
        price: 18.0,
        stock: 22,
        label: '2 m',
        attributes: { Length: '2 m' },
      },
    ],
  },
  {
    id: 'p-3',
    name: 'Desk Lamp',
    description: 'Warm LED with dimmer. Single configuration for this demo.',
    imageUrl: 'https://placehold.co/640x640/png?text=Lamp',
    categoryId: 'cat-home',
    variants: [
      {
        id: 'p-3-v1',
        sku: 'LAMP-01',
        price: 45.0,
        stock: 6,
        label: 'Default',
        attributes: {},
      },
    ],
  },
];
