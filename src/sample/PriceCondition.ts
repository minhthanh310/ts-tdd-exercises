import { CartItem } from './Cart';

export class PriceConditionFactory {
  static validateType(obj: Object): boolean {
    if (
      obj.hasOwnProperty('grand_total') ||
      obj.hasOwnProperty('total_price') ||
      obj.hasOwnProperty('unit_price')
    )
      return true;
    return false;
  }

  public static instance(obj: any): BasePriceCondition | any {
    if (obj.hasOwnProperty('grand_total')) {
      return new GrandTotal(obj);
    } else if (obj.hasOwnProperty('total_price')) {
      return new TotalPrice(obj);
    } else if (obj.hasOwnProperty('unit_price')) {
      return new UnitPrice(obj);
    }

    return null;
  }
}

export class Comparator {
  static minValue(comparators: Comparator[]): number {
    let min = comparators.reduce(
      (max: number, comparator: Comparator): number => {
        let minSatifyValue = comparator.getMinSatifyValue();
        return Math.max(minSatifyValue, max);
      },
      0
    );

    return min;
  }

  static maxValue(comparators: Comparator[]): number {
    let min = comparators.reduce(
      (min: number, comparator: Comparator): number => {
        let maxSatifyValue = comparator.getMaxSatifyValue();
        return Math.min(maxSatifyValue, min);
      },
      Number.MAX_VALUE
    );

    return min;
  }

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }

  test(num: number): boolean {
    if (this.key === 'is_between') {
      return num >= this.value[0] && num <= this.value[1];
    } else if (this.key === 'is_greater_than') {
      return num > this.value;
    } else if (this.key === 'is_greater_or_equal_to') {
      return num >= this.value;
    } else if (this.key === 'is_smaller_than') {
      return num < this.value;
    } else if (this.key === 'is_smaller_or_equal_to') {
      return num <= this.value;
    }

    return false;
  }

  testInt(num: number): any {
    if (this.key === 'is_between') {
      return {
        min: Math.ceil(this.value[0] / num),
        max: Math.floor(this.value[1] / num)
      };
    } else if (this.key === 'is_greater_than') {
      return { min: Math.ceil(this.value / num + 1) };
    } else if (this.key === 'is_greater_or_equal_to') {
      return { min: Math.ceil(this.value / num) };
    } else if (this.key === 'is_smaller_than') {
      return { max: Math.floor(this.value / num) };
    } else if (this.key === 'is_smaller_or_equal_to') {
      return { max: Math.floor(this.value / num) };
    }

    return null;
  }

  print(): string {
    return this.key + ' ' + this.value;
  }

  getMaxSatifyValue(): number {
    if (this.key === 'is_between') {
      return this.value[1];
    } else if (this.key === 'is_greater_than') {
      return Number.MAX_VALUE;
    } else if (this.key === 'is_greater_or_equal_to') {
      return Number.MAX_VALUE;
    } else if (this.key === 'is_smaller_than') {
      return this.value - 1;
    } else if (this.key === 'is_smaller_or_equal_to') {
      return this.value;
    }
    return Number.MAX_VALUE;
  }

  getMinSatifyValue(): number {
    if (this.key === 'is_between') {
      return this.value[1];
    } else if (this.key === 'is_greater_than') {
      return this.value + 1;
    } else if (this.key === 'is_greater_or_equal_to') {
      return this.value;
    } else if (this.key === 'is_smaller_than') {
      return 0;
    } else if (this.key === 'is_smaller_or_equal_to') {
      return 0;
    }

    return 0;
  }

  key: string;
  value: any;
}

export class BasePriceCondition {
  constructor(c: any) {
    this.object = c;
    this.comparators = [];

    this.parse(this.object);
  }

  parse(object: any): any {
    this.key = Object.keys(object)[0];
    Object.keys(object[this.key]).forEach(comparator_key => {
      this.comparators.push(
        new Comparator(comparator_key, object[this.key][comparator_key])
      );
    });
  }

  print(): string {
    return (
      this.key +
      ' ' +
      (this.comparators.length > 0 ? this.comparatorToString() + ' ' : '')
    );
  }

  comparatorToString(): string {
    let ret = '(';
    this.comparators.forEach((comparator, index) => {
      ret +=
        comparator.print() +
        (index < this.comparators.length - 1 ? ' và ' : ')');
    });
    return ret;
  }

  test(data: any): boolean {
    return false;
  }

  testValue(value: number): boolean {
    return this.comparators.every(comparator => {
      return comparator.test(value);
    });
  }

  getMinSatifyValue(): number {
    return Comparator.minValue(this.comparators);
  }

  getMaxSatifyValue(): number {
    return Comparator.maxValue(this.comparators);
  }

  value: any;
  comparators: Comparator[];
  key: any;
  object: any;
}

export class GrandTotal extends BasePriceCondition {
  constructor(c: any) {
    super(c);
  }

  parse(object: any): any {
    super.parse(object);
    this.value = object[this.key][Object.keys(object[this.key])[0]];
  }

  test(carts: any[]): boolean {
    let total = carts.reduce((acc: number, item: any) => {
      return acc + item.item.price * item.item.min_quantity_needed;
    }, 0);

    return this.comparators.every(comparator => {
      return comparator.test(total);
    });
  }
}

export class TotalPrice extends BasePriceCondition {
  constructor(c: any) {
    super(c);
  }

  parse(object: any): any {
    super.parse(object);
    this.value = object[this.key][Object.keys(object[this.key])[0]];
  }

  test(data: any[]): any {
    let total = 0;

    data.forEach(item => {
      total += item.item.price * item.item.min_quantity_needed;
    });

    return this.comparators.every(comparator => {
      return comparator.test(total);
    });
  }

  isValid(carts: any): any {
    return { ...this.object, price_condition: true };
  }
}

export class UnitPrice extends BasePriceCondition {
  constructor(c: any) {
    super(c);
  }

  parse(object: any): any {
    super.parse(object);
    this.value = object[this.key][Object.keys(object[this.key])[0]];
  }

  test(item: any): any {
    return this.comparators.every(comparator => {
      return comparator.test(item.price);
    });
  }

  isValid(carts: any): any {
    return { ...this.object, price_condition: true };
  }
}
