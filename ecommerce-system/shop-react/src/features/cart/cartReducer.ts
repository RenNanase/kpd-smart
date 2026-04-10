import type { CartLine } from '../../types/shop.types';

export type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: Omit<CartLine, 'lineId' | 'quantity'> & { quantity?: number };
    }
  | { type: 'REMOVE_LINE'; lineId: string }
  | { type: 'SET_QUANTITY'; lineId: string; quantity: number }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'CLEAR' };

export interface CartState {
  lines: CartLine[];
  drawerOpen: boolean;
}

function lineKey(productId: string, variantId: string): string {
  return `${productId}::${variantId}`;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const qty = Math.max(1, action.payload.quantity ?? 1);
      const existing = state.lines.find(
        (l) =>
          lineKey(l.productId, l.variantId) ===
          lineKey(action.payload.productId, action.payload.variantId),
      );
      if (existing) {
        return {
          ...state,
          drawerOpen: true,
          lines: state.lines.map((l) =>
            l.lineId === existing.lineId
              ? { ...l, quantity: l.quantity + qty }
              : l,
          ),
        };
      }
      const line: CartLine = {
        lineId: crypto.randomUUID(),
        productId: action.payload.productId,
        variantId: action.payload.variantId,
        productName: action.payload.productName,
        variantLabel: action.payload.variantLabel,
        sku: action.payload.sku,
        unitPrice: action.payload.unitPrice,
        quantity: qty,
        imageUrl: action.payload.imageUrl,
      };
      return { ...state, lines: [...state.lines, line], drawerOpen: true };
    }
    case 'REMOVE_LINE':
      return {
        ...state,
        lines: state.lines.filter((l) => l.lineId !== action.lineId),
      };
    case 'SET_QUANTITY': {
      const q = Math.max(0, Math.floor(action.quantity));
      if (q === 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => l.lineId !== action.lineId),
        };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.lineId === action.lineId ? { ...l, quantity: q } : l,
        ),
      };
    }
    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };
    case 'CLEAR':
      return { ...state, lines: [] };
    default:
      return state;
  }
}

export const initialCartState: CartState = {
  lines: [],
  drawerOpen: false,
};

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
