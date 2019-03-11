export function computeCartValue(cart: any[]): number {
  return cart.reduce((value: number, item: any) => {
    return value + item.item.price * item.item.min_quantity_needed;
  }, 0);
}
