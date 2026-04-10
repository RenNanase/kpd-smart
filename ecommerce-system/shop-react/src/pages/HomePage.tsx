import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProductCard } from '../components/product/ProductCard';
import { shopApi } from '../services/shopApi.mock';
import type { Product } from '../types/shop.types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void shopApi.listProducts().then((list) => {
      if (!cancelled) {
        setProducts(list.slice(0, 3));
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page page--home">
      <section className="hero">
        <h1 className="hero__title">Build your cart</h1>
        <p className="hero__lead">
          React storefront demo with variants, drawer cart, and mock API — swap in your
          PostgreSQL REST backend when ready.
        </p>
        <Link to="/products" className="btn btn--primary">
          Browse products
        </Link>
      </section>
      <section className="section">
        <h2 className="section__title">Featured</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
