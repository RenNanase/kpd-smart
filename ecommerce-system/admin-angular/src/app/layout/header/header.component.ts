import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { RolePermissionService } from '../../core/services/role-permission.service';
import { ROLES, type Role } from '../../shared/models/role.model';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly permissions = inject(RolePermissionService);

  protected readonly roles = ROLES;

  protected signOut(): void {
    this.auth.logout();
  }

  protected onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Role;
    this.auth.switchRole(value);
    void this.router.navigateByUrl(this.permissions.getFirstAccessibleUrl());
  }
}
