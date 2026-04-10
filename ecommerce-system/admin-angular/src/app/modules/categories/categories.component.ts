import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header title="Categories" subtitle="Organize products into categories." />
    <p class="placeholder">Placeholder — categories module.</p>
  `,
  styles: `
    .placeholder {
      margin: 0;
      font-size: 0.95rem;
      color: var(--admin-text-muted);
    }
  `,
})
export class CategoriesComponent {}
