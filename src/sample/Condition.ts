import { BasePriceCondition, PriceConditionFactory } from './PriceCondition';
import { Category, Product, Gift } from './Products';
import { CartItem } from './Cart';
import { BaseData, BaseDataTypes } from './BaseData';
import Combo from './Combo';
import * as helpers from './helper';
import _ from 'lodash';

export class ProductCondition extends BaseData {
  static getInstance(productsCondition: BaseDataTypes) {
    if (!productsCondition) {
      return null;
    } else {
      return new ProductCondition(productsCondition);
    }
  }

  constructor(object: BaseDataTypes) {
    super(object);
    this.conditions = [];

    this.parse();
  }

  parse(): any {
    let condition = super.parse();

    condition.forEach((c: any) => {
      if (Category.validateType(c)) {
        this.conditions.push(new Category(c.category));
      } else if (Product.validateType(c)) {
        this.conditions.push(new Product(c.product));
        // } else if (PriceConditionFactory.validateType(c)) {
        //   this.conditions.push(PriceConditionFactory.instance(c));
      } else if (c.is_all_of || c.is_one_of) {
        this.conditions.push(new ProductCondition(c));
      }
    });
  }

  isValidProducts(products: CartItem[]) {
    for (let condition of this.conditions) {
      let satifiedProducts = condition.isValid(products);
      if (
        !satifiedProducts ||
        satifiedProducts.length === 0 ||
        satifiedProducts.some(
          (satItem: any) =>
            satItem.length > 0 &&
            products.findIndex(
              item =>
                item.sku === satItem[0].item.sku &&
                item.quantity === satItem[0].item.min_quantity_needed
            ) === -1
        )
      ) {
        // newItem is not existed in products
        return false;
      }
    }

    return true;
  }

  isCombo(): boolean {
    return this.type === 'and';
  }

  getAllComboConditions(): object[] {
    if (this.type === 'and') {
      return [this.object];
    } else if (this.type === 'or') {
      return this.conditions.reduce((comboCondition, condition) => {
        if (condition instanceof ProductCondition) {
          return [...comboCondition, ...condition.getAllComboConditions()];
        } else {
          return comboCondition;
        }
      }, []);
    }

    return [];
  }

  isValidProduct(product: CartItem): any {
    if (this.type === 'and') {
      return null;
    }

    let validProduct = null;
    for (let condition of this.conditions) {
      validProduct = condition.isValidProduct(product);
      if (validProduct) {
        return validProduct;
      }
    }

    return null;
  }

  isValid(carts: CartItem[]): any {
    let ret: any = null;

    let collections: any = [];
    this.conditions.forEach((condition: any) => {
      let newItem = condition.isValid(carts);
      // console.log(condition.print(), JSON.stringify(newItem));
      collections.push(newItem);
    });

    if (this.type === 'and') {
      if (
        collections.every((items: any) => {
          return items !== null;
        })
      ) {
        collections.forEach((collection: any) => {
          // console.log('ret: ', JSON.stringify(ret));
          // console.log('collection: ', JSON.stringify(collection));
          if (!ret || ret.length === 0) {
            // Trạng thái khởi tạo đầu tiên
            if (collection) ret = collection;
          } else {
            collection.forEach((c: any) => {
              if (Array.isArray(c)) {
                c.forEach((col: any) => {
                  let result: any = [];
                  ret.forEach((res: any, i: number) => {
                    // console.log('res: ', JSON.stringify(res));
                    // console.log('c: ', JSON.stringify(c));
                    let index = res.findIndex(
                      (r: any) => r.item.sku === col.item.sku
                    );
                    if (index !== -1) {
                      res[index].item.min_quantity_needed =
                        res[index].item.min_quantity_needed +
                        col.item.min_quantity_needed;
                    } else {
                      ret[i] = res.concat(col);
                    }
                  });
                });
              }
            });
          }
        });
      }
    } else if (this.type === 'or') {
      collections.forEach((collection: any) => {
        if (collection) {
          if (!ret || ret.length === 0) {
            // Trạng thái khởi tạo đầu tiên
            if (collection) ret = collection;
          } else {
            collection.forEach((c: any) => {
              // console.log('ret: ', JSON.stringify(ret));
              // console.log('collection: ', JSON.stringify(collection));
              let shouldAdd = false;
              if (Array.isArray(c)) {
                ret.forEach((res: any, i: number) => {
                  // console.log('res: ', JSON.stringify(res));
                  // console.log('c: ', JSON.stringify(c));
                  if (
                    c.every((col: any) => {
                      return (
                        res.findIndex(
                          (r: any) =>
                            r.item.sku === col.item.sku &&
                            r.item.min_quantity_needed >=
                              col.item.min_quantity_needed
                        ) !== -1
                      );
                    })
                  ) {
                    ret.splice(i, 1);
                    shouldAdd = true;
                  } else {
                    shouldAdd = true;
                  }
                });
              }
              shouldAdd && ret.push(c);
            });
          }
        }
      });
    }

    return ret;
  }

  print(): string {
    let ret = '(';
    this.conditions.forEach((condition: any, index) => {
      let str = condition.print();
      ret +=
        str +
        (index < this.conditions.length - 1
          ? this.type === 'or'
            ? ' hoặc '
            : ' và '
          : ')');
    });
    return ret;
  }

  conditions: any[];
}

export interface ConditionTypes {
  products: any;
  value: any;
  combo: any;
}

export class Condition {
  constructor(object: ConditionTypes) {
    this.products_condition = null;
    this.value_condition = null;
    this.combo = null;
    this.object = object;

    this.parse();
  }

  parse(): any {
    this.combo = Combo.getInstance(this.object.combo);
    this.products_condition = ProductCondition.getInstance(
      this.object.products
    );
    if (
      this.object.hasOwnProperty('value_condition') &&
      PriceConditionFactory.validateType(this.object.value_condition)
    ) {
      this.value_condition = PriceConditionFactory.instance(
        this.object.value_condition
      );
    }
  }

  print(): string {
    return this.products_condition ? this.products_condition.print() : '';
  }

  isCombo(): boolean {
    if (this.combo) {
      return true;
    }

    if (this.products_condition) {
      return this.products_condition.isCombo();
    }
    return false;
  }

  getAllComboConditions(): object[] {
    if (this.combo) {
      return [this.combo.getComboObject()];
    }

    if (this.products_condition) {
      return this.products_condition.getAllComboConditions();
    }

    return [];
  }

  getValueRange(): any {
    if (this.value_condition) {
      let minSatifyValue = this.value_condition.getMinSatifyValue();
      let maxSatifyValue = this.value_condition.getMaxSatifyValue();
      return {
        min_value: minSatifyValue,
        max_value: maxSatifyValue
      };
    }

    return null;
  }

  isValidProduct(product: CartItem): any {
    if (!this.products_condition) {
      return null;
    }

    let validProduct = this.products_condition.isValidProduct(product);
    if (validProduct && this.value_condition) {
      let value = validProduct.min_quantity_needed * validProduct.price;
      if (!this.value_condition.testValue(value)) {
        validProduct = null;
      }
    }

    return validProduct;
  }

  isValid(carts: CartItem[]) {
    let ret = this.products_condition
      ? this.products_condition.isValid(carts)
      : [];

    if (ret && this.value_condition) {
      let result: any = [];
      if (this.value_condition.key === 'total_price') {
        ret.forEach((res: any, i: number) => {
          if (this.value_condition.test(res)) {
            result.push(res);
          }
        });
        ret = result;
      } else if (this.value_condition.key === 'grand_total') {
        let final_result: any = [];
        ret.forEach((res: any, i: number) => {
          if (!this.value_condition.test(res)) {
            let cart_left: any[] = [];
            carts.forEach((c: any) => {
              let index = res.findIndex((r: any) => r.item.sku === c.sku);
              if (index !== -1) {
                if (c.quantity - res[index].item.min_quantity_needed > 0)
                  cart_left.push({
                    ...c,
                    quantity: c.quantity - res[index].item.min_quantity_needed
                  });
              } else cart_left.push(c);
            });
            let pairingDatas = pairingItems(cart_left);
            // console.log('Final Pairing Data: ', JSON.stringify(pairingDatas));

            pairingDatas.forEach((c: any) => {
              if (Array.isArray(c)) {
                // console.log('CCCCCC: ', c);
                let result: any = _.cloneDeep(res);
                c.forEach((col: any) => {
                  let index = result.findIndex(
                    (r: any) => r.item.sku === col.item.sku
                  );
                  if (index !== -1) {
                    result[index].item.min_quantity_needed =
                      result[index].item.min_quantity_needed +
                      col.item.min_quantity_needed;
                  } else {
                    result = result.concat(col);
                  }
                });
                if (this.value_condition.test(result)) {
                  let r_index = final_result.findIndex((r: any) => {
                    return (
                      r.length === result.length &&
                      r.every((item: any) => {
                        return result.some((p: any) => {
                          return (
                            item.item.sku === p.item.sku &&
                            item.item.min_quantity_needed >=
                              p.item.min_quantity_needed
                          );
                        });
                      })
                    );
                  });

                  if (r_index !== -1) {
                    final_result[r_index] === result;
                  } else {
                    if (
                      final_result.findIndex((r: any) => {
                        return (
                          r.length === result.length &&
                          r.every((item: any) => {
                            return result.some((p: any) => {
                              return (
                                item.item.sku === p.item.sku &&
                                item.item.min_quantity_needed <=
                                  p.item.min_quantity_needed
                              );
                            });
                          })
                        );
                      })
                    )
                      final_result.push(result);
                  }
                }
              }
            });
          } else {
            final_result.push(res);
          }
        });
        // console.log('final_result: ', JSON.stringify(final_result));
        ret = final_result;
      }
    }

    // console.log('final ret: ', JSON.stringify(ret));
    // console.log(
    //   '-----------------------------------------------------------------------'
    // );

    return ret && ret.length > 0 ? ret : null;
  }

  isValidWithoutUsingPairing(carts: CartItem[]) {
    let ret = this.products_condition
      ? this.products_condition.isValid(carts)
      : [];

    let formatedCartsToTestValue = carts.map(cartItem => ({
      item: { ...cartItem, min_quantity_needed: cartItem.quantity }
    }));

    if (ret && this.value_condition) {
      let result: any = [];
      if (this.value_condition.key === 'total_price') {
        ret.forEach((res: any, i: number) => {
          let grandTotal = helpers.computeCartValue(res);
          if (this.value_condition.testValue(grandTotal)) {
            result.push({
              data: res,
              grand_total: grandTotal,
              real_value: grandTotal
            });
          }
        });
        ret = result;
      } else if (this.value_condition.key === 'grand_total') {
        let minSatifyValue = this.value_condition.getMinSatifyValue();
        let maxSatifyValue = this.value_condition.getMaxSatifyValue();
        let totalCartValue = helpers.computeCartValue(formatedCartsToTestValue);
        if (totalCartValue >= minSatifyValue) {
          ret.forEach((res: any, i: number) => {
            let grandTotal = helpers.computeCartValue(res);
            if (grandTotal <= maxSatifyValue) {
              result.push({
                data: res,
                grand_total: Math.max(minSatifyValue, grandTotal),
                real_value: grandTotal,
                min_value: minSatifyValue,
                max_value: maxSatifyValue
              });
            }
          });
        }
        ret = result;
      }
    } else if (ret) {
      ret = ret.map((data: any) => {
        let value = helpers.computeCartValue(data);
        return {
          data,
          grand_total: value,
          real_value: value
        };
      });
    }

    return ret && ret.length > 0 ? ret : null;
  }

  getCorrespondingPromo(products: CartItem[]): any {
    let isValidProductCondition = this.products_condition
      ? this.products_condition.isValidProducts(products)
      : true;

    let correspondingPromo = null;

    if (isValidProductCondition) {
      let formatedProducts = products.map(product => ({
        item: { ...product, min_quantity_needed: product.quantity }
      }));
      let totalProductsValue = helpers.computeCartValue(formatedProducts);

      if (this.value_condition) {
        if (this.value_condition.key === 'total_price') {
          if (this.value_condition.testValue(totalProductsValue)) {
            correspondingPromo = {
              data: formatedProducts,
              grand_total: totalProductsValue,
              real_value: totalProductsValue
            };
          }
        } else if (this.value_condition.key === 'grand_total') {
          if (this.value_condition.testValue(totalProductsValue)) {
            correspondingPromo = {
              data: formatedProducts,
              grand_total: totalProductsValue,
              real_value: totalProductsValue,
              min_value: this.value_condition.getMinSatifyValue(),
              max_value: this.value_condition.getMaxSatifyValue()
            };
          }
        }
      } else {
        correspondingPromo = {
          data: formatedProducts,
          grand_total: totalProductsValue,
          real_value: totalProductsValue
        };
      }
    }

    return correspondingPromo;
  }

  products_condition: ProductCondition | null; // should be Products condition types
  value_condition: any;
  combo: Combo | null;
  object: any;
}

function pairingItems(carts: CartItem[]) {
  let result: any = [];
  if (carts.length > 0) {
    let item = carts[0];
    for (let i = 1; i <= item.quantity; i++) {
      let data = [
        { item: { sku: item.sku, min_quantity_needed: i, price: item.price } }
      ];
      result.push(data);

      let cart_left: CartItem[] = [];
      carts.forEach(c => {
        if (c.sku !== item.sku) cart_left.push(c);
      });

      let pairingDatas = pairingItems(cart_left);

      if (pairingDatas) {
        pairingDatas.forEach((pair: any) => {
          result.push(data.concat(pair));
          if (
            !result.some((r: any) => {
              return (
                r.length === pair.length &&
                r.every((item: any) => {
                  return pair.some((p: any) => {
                    return (
                      item.item.sku === p.item.sku &&
                      item.item.min_quantity_needed ===
                        p.item.min_quantity_needed
                    );
                  });
                })
              );
            })
          ) {
            result.push(pair);
          }
        });
      }
    }

    return result;
  } else {
    return null;
  }
}
