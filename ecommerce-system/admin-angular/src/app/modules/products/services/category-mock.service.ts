import { Injectable, signal } from '@angular/core';

import type { Category } from '../../../shared/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryMockService {
  private readonly categories = signal<Category[]>([
    { id: 'cat-electronics', name: 'Electronics' },
    { id: 'cat-apparel', name: 'Apparel' },
    { id: 'cat-home', name: 'Home & Living' },
  ]);

  readonly all = this.categories.asReadonly();

  getName(id: string | null): string {
    if (!id) {
      return '—';
    }
    return this.categories().find((c) => c.id === id)?.name ?? '—';
  }
}
