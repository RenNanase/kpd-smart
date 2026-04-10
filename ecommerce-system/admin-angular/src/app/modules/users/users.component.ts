import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header title="Users" subtitle="Admin accounts and role assignments." />
    <p class="placeholder">Placeholder — users module.</p>
  `,
  styles: `
    .placeholder {
      margin: 0;
      font-size: 0.95rem;
      color: var(--admin-text-muted);
    }
  `,
})
export class UsersComponent {}
