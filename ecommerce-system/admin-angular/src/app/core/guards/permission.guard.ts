import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { RolePermissionService } from '../services/role-permission.service';
import type { AdminRouteData } from '../../shared/models/route-data.model';

/**
 * Requires route `data.permissions` (see `AdminRouteData`).
 * Default mode is `any` (user needs at least one listed permission).
 */
export const permissionGuard: CanActivateFn = (route) => {
  const perms = inject(RolePermissionService);
  const router = inject(Router);
  const data = route.data as AdminRouteData;
  const required = data.permissions;
  if (!required?.length) {
    return true;
  }
  const mode = data.permissionMode ?? 'any';
  const ok =
    mode === 'all'
      ? perms.hasAll(required)
      : perms.hasAny(required);
  if (ok) {
    return true;
  }
  return router.parseUrl(perms.getFirstAccessibleUrl());
};
