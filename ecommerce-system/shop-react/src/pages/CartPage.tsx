import { Link } from 'react-router-dom';

import { useCart } from '../features/cart/useCart';
import { formatRM } from '../utils/formatCurrency';

export function CartPage() {
  const { lines, subtotal, removeLine, setQuantity } = useCart();

  return (
    <div className="page">
      <h1 className="page-title">Cart</h1>
      {lines.length === 0 ? (
        <p>
          Your cart is empty.{' '}
          <Link to="/products">Continue shopping</Link>
        </p>
      ) : (
        <>
          <ul className="cart-page__list">
            {lines.map((line) => (
              <li key={line.lineId} className="cart-page__line">
                <div>
                  <strong>{line.productName}</strong>
                  <div className="muted">{line.variantLabel}</div>
                  <div className="muted">SKU {line.sku}</div>
                </div>
                <div className="cart-page__line-price">
                  {formatRM(line.unitPrice * line.quantity)}
                </div>
                <div className="cart-page__controls">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Decrease"
                    onClick={() =>
                      setQuantity(line.lineId, line.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Increase"
                    onClick={() =>
                      setQuantity(line.lineId, line.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => removeLine(line.lineId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-page__summary">
            <p>
              Subtotal: <strong>{formatRM(subtotal)}</strong>
            </p>
            <Link to="/checkout" className="btn btn--primary">
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
