import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { RolePermissionService } from '../../../core/services/role-permission.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  DataTableComponent,
  type DataTableColumn,
} from '../../../shared/components/data-table/data-table.component';
import type { Product } from '../../../shared/models/product.model';
import { formatRM } from '../../../shared/utils/format-currency';
import { CategoryMockService } from '../services/category-mock.service';
import { ProductApiService } from '../services/product-api.service';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, RouterLink, DataTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  protected readonly api = inject(ProductApiService);
  private readonly categories = inject(CategoryMockService);
  private readonly permissions = inject(RolePermissionService);

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
      key: 'sellingPrice',
      label: 'Selling',
      format: (row) => formatRM(row.sellingPrice),
    },
    {
      key: 'sku',
      label: 'SKU',
      format: (row) => row.sku ?? '—',
    },
    {
      key: 'status',
      label: 'Status',
      format: (row) => row.status,
    },
    {
      key: 'rating',
      label: 'Rating',
      format: (row) => String(row.rating),
    },
  ];

  ngOnInit(): void {
    this.api.loadAll();
  }

  protected deleteProduct(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const ok = window.confirm(
      `Delete “${product.name}”? This cannot be undone.`,
    );
    if (ok) {
      this.api.delete(product.id).subscribe({
        error: () =>
          window.alert('Delete failed. Check API and database connection.'),
      });
    }
  }
}
