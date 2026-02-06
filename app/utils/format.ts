export function formatPrice(amount: string | number | null | undefined): string {
  return Number(amount ?? 0).toFixed(2);
}
