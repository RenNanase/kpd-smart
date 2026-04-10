import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useCart } from '../features/cart/useCart';
import { VariantSelector } from '../features/product/VariantSelector';
import { shopApi } from '../services/shopApi.mock';
import type { Product, ProductVariant } from '../types/shop.types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    void shopApi.getProduct(id).then((p) => {
      if (!cancelled) {
        setProduct(p);
        setVariantId(p?.variants[0]?.id ?? null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const selected = useMemo((): ProductVariant | null => {
    if (!product || !variantId) {
      return null;
    }
    return product.variants.find((v) => v.id === variantId) ?? null;
  }, [product, variantId]);

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <p>Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selected || selected.stock <= 0) {
      return;
    }
    addItem({
      productId: product.id,
      variantId: selected.id,
      productName: product.name,
      variantLabel: selected.label,
      sku: selected.sku,
      unitPrice: selected.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="page product-detail">
      <div className="product-detail__grid">
        <img
          src={product.imageUrl}
          alt=""
          className="product-detail__img"
        />
        <div>
          <h1 className="page-title">{product.name}</h1>
          <p className="product-detail__desc">{product.description}</p>
          {selected ? (
            <p className="product-detail__price">
              <strong>${selected.price.toFixed(2)}</strong>
              <span className="muted"> · SKU {selected.sku}</span>
            </p>
          ) : null}
          <VariantSelector
            variants={product.variants}
            valueId={variantId}
            onChange={setVariantId}
          />
          <button
            type="button"
            className="btn btn--primary product-detail__add"
            disabled={!selected || selected.stock <= 0}
            onClick={handleAddToCart}
          >
            {selected && selected.stock <= 0
              ? 'Out of stock'
              : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
