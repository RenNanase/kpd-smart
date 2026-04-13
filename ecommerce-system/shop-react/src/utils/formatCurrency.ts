/** Malaysian Ringgit — single place to change currency display. */
export function formatRM(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}
