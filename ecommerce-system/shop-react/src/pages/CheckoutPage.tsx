import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../features/cart/useCart';
import { shopApi } from '../services/shopApi.mock';
import { formatRM } from '../utils/formatCurrency';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, clearCart } = useCart();
  const [name, setName] = useState('Demo Shopper');
  const [email, setEmail] = useState('shopper@example.com');
  const [address, setAddress] = useState('123 Mock Street');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      return;
    }
    setSubmitting(true);
    try {
      await shopApi.placeOrder({
        total: subtotal,
        lines: lines.map((l) => ({
          name: l.productName,
          sku: l.sku,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      });
      clearCart();
      void navigate('/orders', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Checkout</h1>
        <p>
          Your cart is empty. <Link to="/products">Browse products</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page checkout">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>Address</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
            />
          </label>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
          >
            {submitting ? 'Placing order…' : `Pay ${formatRM(subtotal)}`}
          </button>
        </form>
        <aside className="checkout__aside">
          <h2>Order summary</h2>
          <ul className="checkout__lines">
            {lines.map((l) => (
              <li key={l.lineId}>
                {l.productName} × {l.quantity}{' '}
                <span className="muted">
                  {formatRM(l.unitPrice * l.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="checkout__total">
            Total <strong>{formatRM(subtotal)}</strong>
          </p>
        </aside>
      </div>
    </div>
  );
}
