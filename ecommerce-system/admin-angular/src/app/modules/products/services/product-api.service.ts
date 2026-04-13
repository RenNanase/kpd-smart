import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import type {
  Product,
  ProductCreatePayload,
} from '../../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/products`;

  private readonly list = signal<Product[]>([]);
  readonly products = this.list.asReadonly();
  readonly listError = signal<string | null>(null);

  loadAll(): void {
    this.listError.set(null);
    this.http.get<Product[]>(this.base).subscribe({
      next: (rows) => this.list.set(rows),
      error: () =>
        this.listError.set(
          'Could not load products. Is the API running and the database migrated?',
        ),
    });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  create(body: ProductCreatePayload): Observable<Product> {
    return this.http.post<Product>(this.base, body).pipe(
      tap(() => this.loadAll()),
    );
  }

  update(id: string, body: Partial<ProductCreatePayload>): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}`, body).pipe(
      tap(() => this.loadAll()),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this.loadAll()),
    );
  }

  uploadMedia(images: File[], video: File | null): Observable<{
    imageUrls: string[];
    videoUrl: string | null;
  }> {
    const fd = new FormData();
    for (const f of images) {
      fd.append('images', f);
    }
    if (video) {
      fd.append('video', video);
    }
    return this.http.post<{
      imageUrls: string[];
      videoUrl: string | null;
    }>(`${environment.apiBaseUrl}/api/upload/media`, fd);
  }
}
