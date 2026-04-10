import type { Dispatch } from 'react';

import type { CartLine } from '../../types/shop.types';
import type { CartAction } from './cartReducer';

export interface CartContextValue {
  lines: CartLine[];
  drawerOpen: boolean;
  itemCount: number;
  subtotal: number;
  dispatch: Dispatch<CartAction>;
  addItem: (input: {
    productId: string;
    variantId: string;
    productName: string;
    variantLabel: string;
    sku: string;
    unitPrice: number;
    quantity?: number;
    imageUrl?: string;
    openDrawer?: boolean;
  }) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearCart: () => void;
}
