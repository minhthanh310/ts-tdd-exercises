import { CartItem } from './Cart';

export class PriceBenefitFactory {
  static validateType(obj: Object): boolean {
    if (
      obj.hasOwnProperty('promotion_price') ||
      obj.hasOwnProperty('grand_discount') ||
      obj.hasOwnProperty('promotion_discount')
    )
      return true;
    return false;
  }

  public static instance(obj: any): BasePriceBenefit | any {
    if (obj.hasOwnProperty('promotion_price')) {
      return new PromotionPrice(obj);
    } else if (obj.hasOwnProperty('grand_discount')) {
      return new GrandDiscount(obj);
    } else if (obj.hasOwnProperty('promotion_discount')) {
      return new PromotionDiscount(obj);
    }

    return null;
  }
}

export class BasePriceBenefit {
  constructor(c: any) {
    this.object = c;
  }

  isValid(carts: CartItem[]): boolean {
    let ret = false;

    return ret;
  }

  print(): string {
    return (
      this.key +
      ' ' +
      (this.operator ? this.operator + ' ' : '') +
      this.value.toString()
    );
  }

  value: any;
  operator: any;
  key: any;
  object: any;
}

export class PromotionPrice extends BasePriceBenefit {
  constructor(c: any) {
    super(c);
  }

  parse(object: any): any {
    this.key = 'promotion_price';
    this.value = object[this.key];
  }
}

export class PromotionDiscount extends BasePriceBenefit {
  constructor(c: any) {
    super(c);
  }

  parse(object: any): any {
    this.key = 'promotion_discount';
    this.value = object[this.key];
  }
}

export class GrandDiscount extends BasePriceBenefit {
  constructor(c: any) {
    super(c);
  }

  parse(object: any): any {
    this.key = 'grand_discount';
    this.value = object[this.key];
  }
}

export class DiscountPercentage extends BasePriceBenefit {
  constructor(object: any) {
    super(object);
  }

  parse(object: any): any {
    this.key = 'discount_percentage';
    this.value = object[this.key];
  }
}
