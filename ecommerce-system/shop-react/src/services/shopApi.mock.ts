import type { MockUser, Order, Product } from '../types/shop.types';
import { SEED_PRODUCTS } from '../mocks/seedProducts';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const products: Product[] = [...SEED_PRODUCTS];
const orders: Order[] = [
  {
    id: 'ord-demo-1',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    total: 59.98,
    status: 'shipped',
    lines: [
      { name: 'Classic Tee', sku: 'TEE-RED-M', quantity: 2, unitPrice: 29.99 },
    ],
  },
];

const mockUser: MockUser = {
  id: 'u-demo',
  name: 'Demo Shopper',
  email: 'shopper@example.com',
};

/**
 * Mock shop API. Replace with real HTTP calls to your REST API later.
 */
export const shopApi = {
  async listProducts(): Promise<Product[]> {
    await delay(120);
    return [...products];
  },

  async getProduct(id: string): Promise<Product | null> {
    await delay(100);
    return products.find((p) => p.id === id) ?? null;
  },

  async getCurrentUser(): Promise<MockUser> {
    await delay(50);
    return { ...mockUser };
  },

  async listOrders(): Promise<Order[]> {
    await delay(150);
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async placeOrder(payload: {
    lines: { name: string; sku: string; quantity: number; unitPrice: number }[];
    total: number;
  }): Promise<Order> {
    await delay(200);
    const order: Order = {
      id: `ord-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      total: payload.total,
      status: 'paid',
      lines: payload.lines.map((l) => ({
        name: l.name,
        sku: l.sku,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
    };
    orders.unshift(order);
    return order;
  },
};
