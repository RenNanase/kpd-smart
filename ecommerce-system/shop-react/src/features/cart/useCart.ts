import { useContext } from 'react';

import { CartContext } from './cart-context';
import type { CartContextValue } from './cart-types';

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
