import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-stock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header title="Stock" subtitle="Inventory levels and warehouse movements." />
    <p class="placeholder">Placeholder — stock module.</p>
  `,
  styles: `
    .placeholder {
      margin: 0;
      font-size: 0.95rem;
      color: var(--admin-text-muted);
    }
  `,
})
export class StockComponent {}
