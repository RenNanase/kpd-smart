import { useEffect, useState } from 'react';

import { ProductCard } from '../components/product/ProductCard';
import { shopApi } from '../services/shopApi.mock';
import type { Product } from '../types/shop.types';

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void shopApi.listProducts().then((list) => {
      if (!cancelled) {
        setProducts(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">All products</h1>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
