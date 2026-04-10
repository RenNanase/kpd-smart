import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header title="Orders" subtitle="Review and fulfill customer orders." />
    <p class="placeholder">Placeholder — orders module.</p>
  `,
  styles: `
    .placeholder {
      margin: 0;
      font-size: 0.95rem;
      color: var(--admin-text-muted);
    }
  `,
})
export class OrdersComponent {}
