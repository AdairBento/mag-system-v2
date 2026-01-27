/**
 * Formata valor em real (R$ 1.234,56)
 */
export function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Calcula desconto
 */
export function calculateDiscount(
  amount: number,
  discountPercentage: number,
): number {
  return amount * (discountPercentage / 100);
}

/**
 * Aplica desconto
 */
export function applyDiscount(
  amount: number,
  discountPercentage: number,
): number {
  const discount = calculateDiscount(amount, discountPercentage);
  return amount - discount;
}

/**
 * Calcula valor total de locação
 */
export function calculateRentalTotal(
  dailyRate: number,
  days: number,
  discountPercentage: number = 0,
): { subtotal: number; discount: number; total: number } {
  const subtotal = dailyRate * days;
  const discount = calculateDiscount(subtotal, discountPercentage);
  const total = subtotal - discount;

  return { subtotal, discount, total };
}
