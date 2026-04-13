import { Link } from 'react-router-dom';

import { formatRM } from '../../utils/formatCurrency';

import type { Product } from '../../types/shop.types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const from = Math.min(...product.variants.map((v) => v.price));
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        <img
          src={product.imageUrl}
          alt=""
          className="product-card__img"
          loading="lazy"
        />
        <h2 className="product-card__title">{product.name}</h2>
        <p className="product-card__from">From {formatRM(from)}</p>
      </Link>
    </article>
  );
}
