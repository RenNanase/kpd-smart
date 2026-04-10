import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { RolePermissionService } from '../../core/services/role-permission.service';

/**
 * Navigates to the first module URL allowed for the current role (see `NAV_ITEMS` order).
 */
@Component({
  selector: 'app-default-redirect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class DefaultRedirectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly permissions = inject(RolePermissionService);

  ngOnInit(): void {
    void this.router.navigateByUrl(this.permissions.getFirstAccessibleUrl());
  }
}
