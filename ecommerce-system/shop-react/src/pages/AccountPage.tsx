import { useEffect, useState } from 'react';

import { shopApi } from '../services/shopApi.mock';
import type { MockUser } from '../types/shop.types';

export function AccountPage() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void shopApi.getCurrentUser().then((u) => {
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Account</h1>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : user ? (
        <dl className="account-dl">
          <dt>Name</dt>
          <dd>{user.name}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>User ID</dt>
          <dd className="muted">{user.id}</dd>
        </dl>
      ) : null}
      <p className="muted">
        Mock profile — replace with real auth and profile API.
      </p>
    </div>
  );
}
