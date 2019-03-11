import { Category, Product, Gift } from './Products';
import { CartItem } from './Cart';
import { BaseData, BaseDataTypes } from './BaseData';
import { PriceBenefitFactory } from './PriceBenefit';
import { Voucher } from './Voucher';

export class Benefit extends BaseData {
  constructor(object: BaseDataTypes) {
    super(object);
    this.benefits = [];

    this.parse();
  }

  parse(): any {
    let benefits = super.parse();

    benefits.forEach((c: any) => {
      if (Voucher) {
        this.benefits.push(new Voucher(c.voucher));
      } else if (Gift.validateType(c)) {
        this.benefits.push(new Gift(c.gift));
      } else if (PriceBenefitFactory.validateType(c)) {
        this.benefits.push(PriceBenefitFactory.instance(c));
      } else if (c.is_all_of || c.is_one_of) {
        this.benefits.push(new Benefit(c));
      }
    });
  }

  calculateQuantityLeft(): number {
    let ret = 0;
    if (this.type === 'and') {
      this.benefits.forEach(benefit => {
        if (benefit.sku && benefit.quantity_left > 0) {
          ret = Math.max(ret, benefit.quantity_left);
        }
      });
    } else if (this.type === 'or')
      this.benefits.forEach(benefit => {
        if (benefit.sku && benefit.quantity_left > 0)
          ret = ret + benefit.quantity_left;
      });

    return ret;
  }

  isAvailable(): boolean {
    let available = false;
    this.benefits.forEach(benefit => {
      if (
        !benefit.sku ||
        !benefit.quantity_left ||
        (benefit.sku && benefit.quantity_left > 0)
      )
        available = true;
    });
    return available;
  }

  print(): string {
    let ret = '(';
    this.benefits.forEach((condition: any, index) => {
      let str = condition.print();
      ret +=
        str +
        (index < this.benefits.length - 1
          ? this.type === 'or'
            ? ' hoặc '
            : ' và '
          : ')');
    });
    return ret;
  }

  benefits: any[];
}
