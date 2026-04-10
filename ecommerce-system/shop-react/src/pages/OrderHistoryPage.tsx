import { useEffect, useState } from 'react';

import { shopApi } from '../services/shopApi.mock';
import type { Order } from '../types/shop.types';

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void shopApi.listOrders().then((list) => {
      if (!cancelled) {
        setOrders(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Order history</h1>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="order-card">
              <div className="order-card__head">
                <strong>{o.id}</strong>
                <span className={`status status--${o.status}`}>{o.status}</span>
              </div>
              <div className="muted">
                {new Date(o.createdAt).toLocaleString()}
              </div>
              <ul className="order-card__lines">
                {o.lines.map((l, i) => (
                  <li key={i}>
                    {l.name} × {l.quantity} @ ${l.unitPrice.toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="order-card__total">
                Total: <strong>${o.total.toFixed(2)}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
