import { BasePriceCondition, PriceConditionFactory } from './PriceCondition';
import { Category, Product, Gift } from './Products';
import { CartItem } from './Cart';

export interface BaseDataTypes {
  is_one_of: (BaseDataTypes | Category | Product)[] | null;
  is_all_of: (BaseDataTypes | Category | Product)[] | null;
}

export class BaseData {
  constructor(object: BaseDataTypes) {
    this.object = object;
    this.type = 'and';
  }

  parse(): any {
    let condition: any = {};
    if (!this.object) {
      return null;
    } else if (this.object.is_all_of) {
      this.type = 'and';
      condition = this.object.is_all_of;
    } else if (this.object.is_one_of) {
      this.type = 'or';
      condition = this.object.is_one_of;
    } else {
      console.log('This is clear an error');
      return null;
    }

    return condition;
  }

  type: string;
  object: BaseDataTypes;
}
