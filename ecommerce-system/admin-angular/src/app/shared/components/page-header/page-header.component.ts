import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <h1 class="title">{{ title() }}</h1>
      @if (subtitle(); as sub) {
        <p class="subtitle">{{ sub }}</p>
      }
    </header>
  `,
  styles: `
    .page-header {
      margin-bottom: 1.5rem;
    }
    .title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--admin-text);
    }
    .subtitle {
      margin: 0.35rem 0 0;
      font-size: 0.9rem;
      color: var(--admin-text-muted);
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
