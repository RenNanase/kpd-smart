import type { Routes } from '@angular/router';

import { permissionGuard } from '../../core/guards/permission.guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products-shell.component').then((m) => m.ProductsShellComponent),
    canActivate: [permissionGuard],
    data: { permissions: ['products.view'] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
        canActivate: [permissionGuard],
        data: { permissions: ['products.view'] },
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
        canActivate: [permissionGuard],
        data: { permissions: ['products.manage'], mode: 'create' as const },
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
        canActivate: [permissionGuard],
        data: { permissions: ['products.manage'], mode: 'edit' },
      },
    ],
  },
];
