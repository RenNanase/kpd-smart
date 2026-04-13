import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type {
  Product,
  ProductCreatePayload,
  ProductStatus,
} from '../../../shared/models/product.model';
import { CategoryMockService } from '../services/category-mock.service';
import { ProductApiService } from '../services/product-api.service';

@Component({
  selector: 'app-product-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly api = inject(ProductApiService);
  protected readonly categories = inject(CategoryMockService);

  protected readonly editingId = signal<string | null>(null);
  protected readonly pageTitle = signal('Add product');
  protected readonly saveError = signal<string | null>(null);
  protected readonly uploading = signal(false);

  readonly productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    categoryId: this.fb.control<string | null>(null),
    status: this.fb.nonNullable.control<ProductStatus>('draft'),
    sellingPrice: [0, [Validators.required, Validators.min(0)]],
    costPrice: [0, [Validators.required, Validators.min(0)]],
    unitOfMeasurement: ['pcs', Validators.required],
    discountPercent: this.fb.control<number | null>(null),
    discountAmount: this.fb.control<number | null>(null),
    sku: this.fb.control<string | null>(null),
    videoUrl: [''],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    images: this.fb.array<FormControl<string>>([]),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const mode = this.route.snapshot.data['mode'] as string | undefined;

    if (id && mode === 'edit') {
      this.editingId.set(id);
      this.pageTitle.set('Edit product');
      this.api.getById(id).subscribe({
        next: (p) => this.patchFromProduct(p),
        error: () => void this.router.navigate(['/products']),
      });
    } else {
      this.addImageRow('');
      this.addImageRow('');
    }
  }

  get images(): FormArray<FormControl<string>> {
    return this.productForm.get('images') as FormArray<FormControl<string>>;
  }

  protected addImageRow(url = ''): void {
    this.images.push(this.fb.control(url, { nonNullable: true }));
  }

  protected removeImageRow(index: number): void {
    this.images.removeAt(index);
  }

  protected onImageFiles(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    input.value = '';
    if (files.length === 0) {
      return;
    }
    this.uploading.set(true);
    this.saveError.set(null);
    this.api.uploadMedia(files, null).subscribe({
      next: ({ imageUrls }) => {
        for (const u of imageUrls) {
          this.images.push(this.fb.control(u, { nonNullable: true }));
        }
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
        this.saveError.set('Image upload failed. Check API and file size.');
      },
    });
  }

  protected onVideoFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) {
      return;
    }
    this.uploading.set(true);
    this.saveError.set(null);
    this.api.uploadMedia([], file).subscribe({
      next: ({ videoUrl }) => {
        if (videoUrl) {
          this.productForm.patchValue({ videoUrl });
        }
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
        this.saveError.set('Video upload failed.');
      },
    });
  }

  protected save(): void {
    this.productForm.markAllAsTouched();
    this.saveError.set(null);
    if (this.productForm.invalid) {
      return;
    }

    const raw = this.productForm.getRawValue();
    const imageUrls = (raw.images as string[]).map((u) => u.trim()).filter(Boolean);
    const videoUrl = (raw.videoUrl as string)?.trim() || null;
    const sku = (raw.sku as string | null)?.trim() || null;
    const categoryId = raw.categoryId || null;

    const discountPercent = this.optionalNumber(raw.discountPercent);
    const discountAmount = this.optionalNumber(raw.discountAmount);

    const payload: ProductCreatePayload = {
      name: raw.name as string,
      description: (raw.description as string) ?? '',
      categoryId,
      status: raw.status as ProductStatus,
      sellingPrice: Number(raw.sellingPrice),
      costPrice: Number(raw.costPrice),
      unitOfMeasurement: (raw.unitOfMeasurement as string) || 'unit',
      discountPercent,
      discountAmount,
      sku,
      imageUrls,
      videoUrl,
      rating: Number(raw.rating),
    };

    const id = this.editingId();
    if (id) {
      this.api.update(id, payload).subscribe({
        next: () => void this.router.navigate(['/products']),
        error: (e) =>
          this.saveError.set(
            e?.error?.error ?? e?.message ?? 'Save failed.',
          ),
      });
    } else {
      this.api.create(payload).subscribe({
        next: () => void this.router.navigate(['/products']),
        error: (e) =>
          this.saveError.set(
            e?.error?.error ?? e?.message ?? 'Save failed.',
          ),
      });
    }
  }

  private optionalNumber(v: unknown): number | null {
    if (v === null || v === undefined || v === '') {
      return null;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  private patchFromProduct(p: Product): void {
    this.productForm.patchValue(
      {
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        status: p.status,
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        unitOfMeasurement: p.unitOfMeasurement,
        discountPercent: p.discountPercent,
        discountAmount: p.discountAmount,
        sku: p.sku,
        videoUrl: p.videoUrl ?? '',
        rating: p.rating,
      },
      { emitEvent: false },
    );
    this.images.clear({ emitEvent: false });
    const urls = p.imageUrls.length > 0 ? p.imageUrls : [''];
    for (const u of urls) {
      this.images.push(this.fb.control(u, { nonNullable: true }), { emitEvent: false });
    }
    this.productForm.updateValueAndValidity({ emitEvent: true });
  }
}
