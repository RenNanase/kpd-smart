import { Link } from 'react-router-dom';

import { useCart } from './useCart';

export function CartDrawer() {
  const {
    lines,
    drawerOpen,
    closeDrawer,
    subtotal,
    removeLine,
    setQuantity,
  } = useCart();

  if (!drawerOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="cart-drawer__backdrop"
        aria-label="Close cart"
        onClick={closeDrawer}
      />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-drawer__head">
          <h2 className="cart-drawer__title">Your cart</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={closeDrawer}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {lines.length === 0 ? (
          <p className="cart-drawer__empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-drawer__list">
            {lines.map((line) => (
              <li key={line.lineId} className="cart-drawer__line">
                <div className="cart-drawer__line-main">
                  <span className="cart-drawer__name">{line.productName}</span>
                  <span className="cart-drawer__variant">{line.variantLabel}</span>
                  <span className="cart-drawer__price">
                    ${(line.unitPrice * line.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="cart-drawer__controls">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity(line.lineId, line.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="qty-value">{line.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Increase quantity"
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
        )}
        <div className="cart-drawer__footer">
          <div className="cart-drawer__subtotal">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <Link
            to="/cart"
            className="btn btn--secondary"
            onClick={closeDrawer}
          >
            View cart
          </Link>
          <Link
            to="/checkout"
            className="btn btn--primary"
            onClick={closeDrawer}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
