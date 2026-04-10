import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RolePermissionService } from '../../../core/services/role-permission.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  DataTableComponent,
  type DataTableColumn,
} from '../../../shared/components/data-table/data-table.component';
import type { Product } from '../../../shared/models/product.model';
import { CategoryMockService } from '../services/category-mock.service';
import { ProductMockService } from '../services/product-mock.service';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, RouterLink, DataTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  protected readonly products = inject(ProductMockService);
  private readonly categories = inject(CategoryMockService);
  private readonly permissions = inject(RolePermissionService);

  /** Create / edit / delete require products.manage (seller & admin). */
  protected readonly canManageProducts = computed(() =>
    this.permissions.hasPermission('products.manage'),
  );

  protected readonly columns: DataTableColumn<Product>[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'categoryId',
      label: 'Category',
      format: (row) => this.categories.getName(row.categoryId),
    },
    {
      key: 'status',
      label: 'Status',
      format: (row) => row.status,
    },
    {
      key: 'variants',
      label: 'Variants',
      format: (row) => String(row.variants.length),
    },
  ];

  protected deleteProduct(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const ok = window.confirm(
      `Delete “${product.name}”? This cannot be undone (mock).`,
    );
    if (ok) {
      this.products.delete(product.id);
    }
  }
}
