import type { Role } from './role.model';

/**
 * Fine-grained capabilities. Routes and nav items declare which permissions they require.
 */
export const PERMISSIONS = [
  'dashboard.view',
  'products.view',
  'products.manage',
  'categories.view',
  'categories.manage',
  'orders.view',
  'orders.updateStatus',
  'stock.view',
  'stock.update',
  'users.manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * admin: full access
 * storekeeper: view products, update stock, update order status
 * seller: manage products (+ categories), view orders, view dashboard
 */
export const ROLE_PERMISSIONS: Readonly<Record<Role, ReadonlySet<Permission>>> = {
  admin: new Set(PERMISSIONS),
  storekeeper: new Set<Permission>([
    'products.view',
    'orders.view',
    'orders.updateStatus',
    'stock.view',
    'stock.update',
  ]),
  seller: new Set<Permission>([
    'dashboard.view',
    'products.view',
    'products.manage',
    'categories.view',
    'categories.manage',
    'orders.view',
  ]),
};
