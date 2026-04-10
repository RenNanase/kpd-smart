import { Routes } from '@angular/router';

import { authGuard, loginGuard, permissionGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/login/login.component').then((m) => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./modules/dashboard/default-redirect.component').then(
            (m) => m.DefaultRedirectComponent,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./modules/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        canActivate: [permissionGuard],
        data: { permissions: ['dashboard.view'] },
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./modules/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
        canActivate: [permissionGuard],
        data: { permissions: ['products.view'] },
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./modules/categories/categories.component').then(
            (m) => m.CategoriesComponent,
          ),
        canActivate: [permissionGuard],
        data: {
          permissions: ['categories.view', 'categories.manage'],
          permissionMode: 'any',
        },
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./modules/orders/orders.component').then((m) => m.OrdersComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['orders.view', 'orders.updateStatus'],
          permissionMode: 'any',
        },
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('./modules/stock/stock.component').then((m) => m.StockComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['stock.view', 'stock.update'],
          permissionMode: 'any',
        },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./modules/users/users.component').then((m) => m.UsersComponent),
        canActivate: [permissionGuard],
        data: { permissions: ['users.manage'] },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
