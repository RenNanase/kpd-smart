import type { NavItem } from '../models/nav-item.model';

/** Sidebar entries; visibility uses `RolePermissionService.hasAny(item.permissions)`. */
export const NAV_ITEMS: readonly NavItem[] = [
  { path: 'dashboard', label: 'Dashboard', permissions: ['dashboard.view'] },
  {
    path: 'products',
    label: 'Products',
    permissions: ['products.view', 'products.manage'],
  },
  {
    path: 'categories',
    label: 'Categories',
    permissions: ['categories.view', 'categories.manage'],
  },
  {
    path: 'orders',
    label: 'Orders',
    permissions: ['orders.view', 'orders.updateStatus'],
  },
  {
    path: 'stock',
    label: 'Stock',
    permissions: ['stock.view', 'stock.update'],
  },
  { path: 'users', label: 'Users', permissions: ['users.manage'] },
];
