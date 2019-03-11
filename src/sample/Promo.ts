import { Condition, ConditionTypes } from './Condition';
import { CartItem } from './Cart';
import { BaseDataTypes } from './BaseData';
import { Benefit } from './Benefit';

export interface PromoTypes {
  active: boolean;
  max_quantity: number | null;
  quantity_left: number | null;
  limited_quantity: number | null;
  total_value: number;
  condition: ConditionTypes;
  benefit: BaseDataTypes;
}

export class Promo {
  constructor(promo: PromoTypes, path: string) {
    this.object = promo;
    this.path = path;
    this.condition = null;
    this.benefit = null;

    let object: any = this.parse(this.object);
    this.active = this.object.active;
    this.total_value = this.object.total_value;
    this.quantity_left = this.object.quantity_left;
    this.limited_quantity = this.object.limited_quantity;
  }

  parse(programme: PromoTypes): any {
    this.condition = new Condition(this.object.condition);
    this.benefit = new Benefit(this.object.benefit);
  }

  print(): void {
    console.log('This is promo: ', this.path);
    // console.log('BENEFIT');
    // console.log(this.benefit ? this.benefit.print() : '');
    console.log('CONDITION');
    console.log(this.condition ? this.condition.print() : '');
  }

  isCombo(): boolean {
    if (!this.isActive() || !this.condition || !this.isAvailable()) {
      return false;
    }

    return this.condition.isCombo();
  }

  //get all valid combo(no out of quantity)
  getAllComboConditions(): object[] {
    if (!this.isActive() || !this.condition || !this.isAvailable()) {
      return [];
    }

    return this.condition.getAllComboConditions();
  }

  //get all valid time combo in store, include out of quantity combo
  getAllComboConditionsIncludeOutOfQuantity(): object[] {
    if (!this.object.active || !this.condition || !this.isAvailable()) {
      return [];
    }
    return this.condition.getAllComboConditions();
  }

  getValueRange(): any {
    if (this.condition) {
      return this.condition.getValueRange();
    }
    return null;
  }

  isActive(): boolean {
    return (
      this.object.active &&
      (this.object.quantity_left === null ||
        typeof this.object.quantity_left === 'undefined' ||
        this.object.quantity_left > 0)
    );
  }

  isAvailable(): boolean {
    return this.benefit != null && this.benefit.isAvailable();
  }

  isValidProduct(product: CartItem): boolean {
    if (!this.isActive() || !this.condition || !this.isAvailable()) {
      return false;
    }

    return this.condition.isValidProduct(product);
  }

  isValid(carts: CartItem[]): any {
    if (!this.isActive() || !this.condition || !this.isAvailable()) {
      // console.log('Promo is not active: ', this.path);
      return null;
    }

    let ret = this.condition.isValid(carts);
    // console.log('Final: ', JSON.stringify(ret));
    return ret;
  }

  isValidWithoutUsingPairing(carts: CartItem[]): any {
    if (!this.isActive() || !this.condition || !this.isAvailable()) {
      // console.log('Promo is not active: ', this.path);
      return null;
    }

    let ret = this.condition.isValidWithoutUsingPairing(carts);
    // console.log('Final: ', JSON.stringify(ret));
    return ret;
  }

  getCorrespondingPromo(products: CartItem[]): any {
    if (!this.isActive() || !this.condition || !this.isAvailable()) {
      return null;
    }

    return this.condition.getCorrespondingPromo(products);
  }

  quantity_left: number | null;
  limited_quantity: number | null;
  total_value: number;
  benefit: Benefit | null;
  condition: Condition | null;
  active: boolean;
  object: PromoTypes;
  path: string;
}
