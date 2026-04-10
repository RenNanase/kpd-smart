import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type {
  Product,
  ProductAttributeDefinition,
  ProductStatus,
  ProductVariant,
  VariantStatus,
} from '../../../shared/models/product.model';
import {
  buildVariantAttributeMaps,
  variantSignature,
} from '../../../shared/utils/variant-combinations';
import { CategoryMockService } from '../services/category-mock.service';
import { ProductMockService } from '../services/product-mock.service';

function atLeastOneVariant(group: AbstractControl): ValidationErrors | null {
  const variants = (group as FormGroup).get('variants') as FormArray | null;
  if (!variants || variants.length === 0) {
    return { variantsRequired: true };
  }
  return null;
}

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
  private readonly destroyRef = inject(DestroyRef);
  protected readonly products = inject(ProductMockService);
  protected readonly categories = inject(CategoryMockService);

  protected readonly editingId = signal<string | null>(null);
  protected readonly pageTitle = signal('Create product');

  readonly productForm = this.fb.group(
    {
      name: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      status: this.fb.nonNullable.control<ProductStatus>('draft'),
      images: this.fb.array<FormControl<string>>([]),
      attributes: this.fb.array<FormGroup>([]),
      variants: this.fb.array<FormGroup>([]),
    },
    { validators: [atLeastOneVariant] },
  );

  ngOnInit(): void {
    this.productForm.get('attributes')!.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onAttributesChanged());

    const id = this.route.snapshot.paramMap.get('id');
    const mode = this.route.snapshot.data['mode'] as string | undefined;

    if (id && mode === 'edit') {
      const product = this.products.getById(id);
      if (!product) {
        void this.router.navigate(['/products']);
        return;
      }
      this.editingId.set(id);
      this.pageTitle.set('Edit product');
      this.patchFromProduct(product);
    } else {
      this.initCreateForm();
    }
  }

  get images(): FormArray<FormControl<string>> {
    return this.productForm.get('images') as FormArray<FormControl<string>>;
  }

  get attributes(): FormArray<FormGroup> {
    return this.productForm.get('attributes') as FormArray<FormGroup>;
  }

  get variants(): FormArray<FormGroup> {
    return this.productForm.get('variants') as FormArray<FormGroup>;
  }

  protected addImageRow(): void {
    this.images.push(this.fb.control('', { nonNullable: true }));
  }

  protected removeImageRow(index: number): void {
    this.images.removeAt(index);
  }

  protected addAttributeRow(): void {
    this.attributes.push(
      this.fb.group({
        name: ['', Validators.required],
        values: this.fb.array<FormControl<string>>([
          this.fb.control('', { nonNullable: true }),
        ]),
      }),
    );
  }

  protected removeAttributeRow(index: number): void {
    this.attributes.removeAt(index);
  }

  protected valuesAt(attributeIndex: number): FormArray<FormControl<string>> {
    return this.attributes.at(attributeIndex).get('values') as FormArray<FormControl<string>>;
  }

  protected addValueRow(attributeIndex: number): void {
    this.valuesAt(attributeIndex).push(this.fb.control('', { nonNullable: true }));
  }

  protected removeValueRow(attributeIndex: number, valueIndex: number): void {
    const arr = this.valuesAt(attributeIndex);
    if (arr.length <= 1) {
      return;
    }
    arr.removeAt(valueIndex);
  }

  protected save(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) {
      return;
    }

    const raw = this.productForm.getRawValue();
    const defs = this.readAttributeDefinitions();
    const maps = buildVariantAttributeMaps(defs);

    const variants: ProductVariant[] = this.variants.controls.map((ctrl, i) => {
      const g = ctrl as FormGroup;
      const attrs = maps[i] ?? {};
      return {
        id: (g.get('id')?.value as string) ?? crypto.randomUUID(),
        signature: variantSignature(attrs),
        sku: String(g.get('sku')?.value ?? ''),
        price: Number(g.get('price')?.value),
        stock: Number(g.get('stock')?.value),
        weight: Number(g.get('weight')?.value),
        status: g.get('status')?.value as VariantStatus,
        attributes: attrs,
      };
    });

    const imageUrls = (raw.images as string[]).map((u) => u.trim()).filter(Boolean);

    const product: Product = {
      id: this.editingId() ?? crypto.randomUUID(),
      name: raw.name as string,
      description: (raw.description as string) ?? '',
      categoryId: raw.categoryId as string,
      status: raw.status as ProductStatus,
      imageUrls,
      attributeDefinitions: defs,
      variants,
    };

    if (this.editingId()) {
      this.products.update(this.editingId()!, product);
    } else {
      const { id: _id, ...rest } = product;
      void _id;
      this.products.create(rest);
    }

    void this.router.navigate(['/products']);
  }

  private initCreateForm(): void {
    this.productForm.reset({
      name: '',
      description: '',
      categoryId: '',
      status: 'draft',
    });
    this.images.clear({ emitEvent: false });
    this.attributes.clear({ emitEvent: false });
    this.onAttributesChanged();
  }

  private patchFromProduct(p: Product): void {
    this.productForm.patchValue(
      {
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        status: p.status,
      },
      { emitEvent: false },
    );

    this.images.clear({ emitEvent: false });
    for (const url of p.imageUrls) {
      this.images.push(this.fb.control(url, { nonNullable: true }), { emitEvent: false });
    }

    this.attributes.clear({ emitEvent: false });
    for (const def of p.attributeDefinitions) {
      this.attributes.push(
        this.fb.group({
          name: [def.name, Validators.required],
          values: this.fb.array(
            def.values.map((v) => this.fb.control(v, { nonNullable: true })),
          ),
        }),
        { emitEvent: false },
      );
    }

    this.variants.clear({ emitEvent: false });
    for (const v of p.variants) {
      const label =
        Object.entries(v.attributes)
          .map(([k, val]) => `${k}: ${val}`)
          .join(' · ') || '—';
      this.variants.push(
        this.fb.group({
          id: [v.id],
          sku: [v.sku, Validators.required],
          price: [v.price, [Validators.required, Validators.min(0)]],
          stock: [v.stock, [Validators.required, Validators.min(0)]],
          weight: [v.weight, [Validators.min(0)]],
          status: [v.status],
          attrsDisplay: [{ value: label, disabled: true }],
          signature: [{ value: v.signature, disabled: true }],
        }),
        { emitEvent: false },
      );
    }

    this.productForm.updateValueAndValidity({ emitEvent: true });
  }

  private readAttributeDefinitions(): ProductAttributeDefinition[] {
    return this.attributes.controls
      .map((g, idx) => {
        const name = (g.get('name')?.value as string)?.trim() ?? '';
        const vals = this.valuesAt(idx)
          .getRawValue()
          .map((s) => s.trim())
          .filter(Boolean);
        return { name, values: vals };
      })
      .filter((d) => d.name.length > 0 && d.values.length > 0);
  }

  private onAttributesChanged(): void {
    const defs = this.readAttributeDefinitions();
    const maps = buildVariantAttributeMaps(defs);
    const prev = this.snapshotVariantValues();
    this.variants.clear({ emitEvent: false });
    maps.forEach((attrs, index) => {
      const sig = variantSignature(attrs);
      const prevRow = prev.get(sig);
      const label =
        Object.entries(attrs)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' · ') || '—';
      this.variants.push(
        this.fb.group({
          id: [prevRow?.id ?? crypto.randomUUID()],
          sku: [prevRow?.sku ?? this.suggestSku(index, sig), Validators.required],
          price: [prevRow?.price ?? 0, [Validators.required, Validators.min(0)]],
          stock: [prevRow?.stock ?? 0, [Validators.required, Validators.min(0)]],
          weight: [prevRow?.weight ?? 0, [Validators.min(0)]],
          status: [prevRow?.status ?? 'active'],
          attrsDisplay: [{ value: label, disabled: true }],
          signature: [{ value: sig, disabled: true }],
        }),
        { emitEvent: false },
      );
    });
    this.productForm.updateValueAndValidity({ emitEvent: true });
  }

  private snapshotVariantValues(): Map<
    string,
    {
      id: string;
      sku: string;
      price: number;
      stock: number;
      weight: number;
      status: VariantStatus;
    }
  > {
    const map = new Map();
    for (const ctrl of this.variants.controls) {
      const g = ctrl as FormGroup;
      const sig = g.get('signature')?.getRawValue() as string;
      map.set(sig, {
        id: g.get('id')?.value as string,
        sku: g.get('sku')?.value as string,
        price: Number(g.get('price')?.value),
        stock: Number(g.get('stock')?.value),
        weight: Number(g.get('weight')?.value),
        status: g.get('status')?.value as VariantStatus,
      });
    }
    return map;
  }

  private suggestSku(index: number, signature: string): string {
    const slug = signature.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    return `SKU-${index + 1}-${slug || 'BASE'}`;
  }
}
