import { computed, inject, Injectable } from '@angular/core';

import { NAV_ITEMS } from '../../shared/constants/navigation';
import type { Permission } from '../../shared/models/permissions.model';
import { ROLE_PERMISSIONS } from '../../shared/models/permissions.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
  private readonly auth = inject(AuthService);

  /** Current role's permission set (empty when logged out). */
  readonly permissionSet = computed((): ReadonlySet<Permission> => {
    const role = this.auth.role();
    if (!role) {
      return new Set();
    }
    return ROLE_PERMISSIONS[role];
  });

  hasPermission(permission: Permission): boolean {
    return this.permissionSet().has(permission);
  }

  /** User has at least one of the permissions. */
  hasAny(permissions: readonly Permission[]): boolean {
    if (permissions.length === 0) {
      return true;
    }
    const set = this.permissionSet();
    return permissions.some((p) => set.has(p));
  }

  /** User has every permission in the list. */
  hasAll(permissions: readonly Permission[]): boolean {
    if (permissions.length === 0) {
      return true;
    }
    const set = this.permissionSet();
    return permissions.every((p) => set.has(p));
  }

  /**
   * First sidebar path the user may open (used when a deep link is forbidden).
   * Order follows `NAV_ITEMS`.
   */
  getFirstAccessibleUrl(): string {
    for (const item of NAV_ITEMS) {
      if (this.hasAny([...item.permissions])) {
        return `/${item.path}`;
      }
    }
    return '/login';
  }
}
