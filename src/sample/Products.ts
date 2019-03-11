import { CartItem } from './Cart';
import { PriceConditionFactory } from './PriceCondition';

export interface CategoryTypes {
  code: string;
  include_children: boolean;
  required: boolean;
  quantity: number;
  price_condition: any;
}

export interface ProductTypes {
  sku: string;
  quantity: number;
}

export interface GiftTypes {
  sku: string;
  description: string;
  quantity: number;
  max_quantity: number | null;
  quantity_left: number | null;
}

export class Category {
  static validateType(obj: Object): boolean {
    if (obj.hasOwnProperty('category')) return true;
    return false;
  }

  constructor(category: CategoryTypes) {
    this.category = category;

    if (
      this.category.price_condition &&
      PriceConditionFactory.validateType(this.category.price_condition)
    ) {
      this.price_condition = PriceConditionFactory.instance(
        this.category.price_condition
      );
    } else {
      this.price_condition = { test: (item: any) => true, print: () => '' };
    }
  }

  isValidProduct(product: CartItem): any {
    if (product.category &&
      product.category.length > 0 &&
      (product.category === this.category.code ||
        (this.category.include_children &&
          product.category.indexOf(this.category.code) != -1)) &&
      product.quantity >= this.category.quantity &&
      this.price_condition.test(product)
    ) {
      return {
        sku: product.sku,
        min_quantity_needed: this.category.quantity,
        price: product.price,
        category: product.category,
        required: this.category.required
      };
    }

    return null;
  }

  isValid(carts: CartItem[]): any {
    let ret: any[] = [];
    carts.forEach(item => {
      if (item.category &&
        item.category.length > 0 &&
        (item.category === this.category.code ||
          (this.category.include_children &&
            item.category.indexOf(this.category.code) != -1)) &&
        item.quantity >= this.category.quantity &&
        this.price_condition.test(item)
      )
        ret.push([
          {
            item: {
              sku: item.sku,
              min_quantity_needed: 1,
              price: item.price,
              category: item.category,
              required: this.category.required
            }
          }
        ]);
    });

    return ret.length > 0 ? ret : this.category.required ? null : [[]];
  }

  print(): string {
    return (
      'category is ' +
      this.category.code +
      (this.category.price_condition
        ? ' and ' + this.price_condition.print()
        : '')
    );
  }

  price_condition: any;
  category: CategoryTypes;
}

export class Product {
  static validateType(obj: Object): boolean {
    if (obj.hasOwnProperty('product')) return true;
    return false;
  }

  constructor(product: ProductTypes) {
    this.product = product;
  }

  isValidProduct(product: CartItem): any {
    if (
      product.sku === this.product.sku &&
      product.quantity >= this.product.quantity
    ) {
      return {
        sku: product.sku,
        min_quantity_needed: this.product.quantity,
        category: product.category,
        price: product.price
      };
    }

    return null;
  }

  isValid(carts: CartItem[]): any {
    let ret: any[] = [];
    carts.forEach(item => {
      if (
        item.sku === this.product.sku &&
        item.quantity >= this.product.quantity
      )
        ret.push([
          {
            item: {
              sku: item.sku,
              min_quantity_needed: this.product.quantity,
              category: item.category,
              price: item.price
            }
          }
        ]);
    });

    // return ret.length > 0 ? { is_one_of: ret } : null;
    return ret.length > 0 ? ret : null;
  }

  print(): string {
    return 'product is ' + this.product.sku;
  }

  product: ProductTypes;
}

export class Gift {
  static validateType(obj: Object): boolean {
    if (obj.hasOwnProperty('gift')) return true;
    return false;
  }

  constructor(gift: GiftTypes) {
    this.gift = gift;
  }

  print(): string {
    return 'gift is ' + this.gift.sku;
  }

  public get sku(): string {
    return this.gift.sku;
  }

  public get quantity_left(): number | null {
    return this.gift.quantity_left;
  }

  public get quantity(): number {
    return this.gift.quantity || 1;
  }

  gift: GiftTypes;
}
