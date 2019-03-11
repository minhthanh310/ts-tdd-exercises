import { CartItem } from './Cart';
import { PriceConditionFactory } from './PriceCondition';

export interface VoucherType {
  key: string;
  quantity: number | null;
}

export class Voucher {
  static validateType(obj: Object): boolean {
    if (obj.hasOwnProperty('voucher')) return true;
    return false;
  }

  constructor(voucher: VoucherType) {
    this.voucher = voucher;
  }

  print(): string {
    return 'voucher is ' + this.voucher.key;
  }

  public get quantity(): number {
    return this.voucher.quantity || 1;
  }

  voucher: VoucherType;
}
