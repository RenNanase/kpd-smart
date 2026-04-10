import { computed, inject, Injectable } from '@angular/core';

import { NAV_ITEMS } from '../../shared/constants/navigation';
import type { NavItem } from '../../shared/models/nav-item.model';
import { RolePermissionService } from './role-permission.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly permissions = inject(RolePermissionService);

  /** Sidebar links visible for the signed-in role. */
  readonly visibleItems = computed((): readonly NavItem[] => {
    return NAV_ITEMS.filter((item) =>
      this.permissions.hasAny([...item.permissions]),
    );
  });
}
