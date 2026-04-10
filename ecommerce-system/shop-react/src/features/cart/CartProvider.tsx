import {
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import {
  cartItemCount,
  cartReducer,
  cartSubtotal,
  initialCartState,
} from './cartReducer';
import { CartContext } from './cart-context';
import type { CartContextValue } from './cart-types';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const addItem = useCallback(
    (input: {
      productId: string;
      variantId: string;
      productName: string;
      variantLabel: string;
      sku: string;
      unitPrice: number;
      quantity?: number;
      imageUrl?: string;
      openDrawer?: boolean;
    }) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          productId: input.productId,
          variantId: input.variantId,
          productName: input.productName,
          variantLabel: input.variantLabel,
          sku: input.sku,
          unitPrice: input.unitPrice,
          quantity: input.quantity,
          imageUrl: input.imageUrl,
        },
      });
      if (input.openDrawer === false) {
        dispatch({ type: 'CLOSE_DRAWER' });
      }
    },
    [],
  );

  const removeLine = useCallback((lineId: string) => {
    dispatch({ type: 'REMOVE_LINE', lineId });
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: 'SET_QUANTITY', lineId, quantity });
  }, []);

  const openDrawer = useCallback(() => {
    dispatch({ type: 'OPEN_DRAWER' });
  }, []);

  const closeDrawer = useCallback(() => {
    dispatch({ type: 'CLOSE_DRAWER' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const itemCount = useMemo(
    () => cartItemCount(state.lines),
    [state.lines],
  );
  const subtotal = useMemo(() => cartSubtotal(state.lines), [state.lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      drawerOpen: state.drawerOpen,
      itemCount,
      subtotal,
      dispatch,
      addItem,
      removeLine,
      setQuantity,
      openDrawer,
      closeDrawer,
      clearCart,
    }),
    [
      state.lines,
      state.drawerOpen,
      itemCount,
      subtotal,
      addItem,
      removeLine,
      setQuantity,
      openDrawer,
      closeDrawer,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
