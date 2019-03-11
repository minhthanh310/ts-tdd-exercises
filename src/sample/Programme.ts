import { DateTime, DateTimeTypes, DateTimeValidator } from "./DateTime";
import { PromoTypes, Promo } from "./Promo";
import { CartItem } from "./Cart";

export interface PromoProgrammeType {
  key: string;
  name: string;
  description: string;
  branches: string[] | null;
  channels: string[] | null;
  onePerPerson: boolean;
  requireEvidence: boolean;
  applyWithOthers: boolean;
  dateTime: DateTime;
  data: {
    [key: string]: PromoTypes;
  };
}

export class PromoProgramme {
  constructor(programme: PromoProgrammeType, path: string) {
    this.object = programme;
    this.path = path;

    let object: any = this.parse(this.object);

    // Parse Result
    this.dateTime = object.dateTime;
    this.promos = object.promos;
    this.applyWithOthers = object.applyWithOthers;
  }

  parse(programme: PromoProgrammeType): any {
    let data = this.object.data;

    let promos: any = {};
    Object.keys(data).forEach(key => {
      let promo = new Promo(data[key], key);
      promos[key] = promo;
    });

    return {
      dateTime: programme.dateTime,
      applyWithOthers: programme.applyWithOthers,
      promos
    };
  }

  suggestPromo(carts: CartItem[], current_promo: any): any {
    let result: any = [];
    Object.keys(this.promos).forEach((key: any, index: number) => {
      // console.log('CHECKING PROMO: ', key);
      let data = this.promos[key].isValid(carts);
      if (data) {
        data.forEach((d: any, i: number) => {
          result.push({
            key,
            data: d,
            path: key + "/" + i,
            total_value: this.promos[key].total_value,
            benefit: this.promos[key].object.benefit,
            quantity_left: this.promos[key].quantity_left,
            limited_quantity: this.promos[key].limited_quantity
          });
        });
      }
    });

    return result.length > 0 ? result : null;
  }

  getCorrespondingPromo(products: CartItem[], promoKey: string): any {
    let correspondingPromo = null;
    for (let key of Object.keys(this.promos)) {
      if (key === promoKey) {
        correspondingPromo = this.promos[key].getCorrespondingPromo(products);
        if (correspondingPromo) {
          return {
            key,
            programName: this.object.name,
            description: this.promos[key].object.description,
            data: correspondingPromo.data,
            grand_total: correspondingPromo.grand_total,
            real_value: correspondingPromo.real_value,
            min_value: correspondingPromo.min_value,
            max_value: correspondingPromo.max_value,
            path: key + "/-1",
            total_value: this.promos[key].total_value,
            benefit: this.promos[key].object.benefit,
            quantity_left: this.promos[key].quantity_left,
            limited_quantity: this.promos[key].limited_quantity
          };
        } else {
          return null;
        }
      }
    }

    return null;
  }

  print(): void {
    Object.keys(this.promos).forEach((key: string) => {
      this.promos[key].print();
      console.log("=======================================================");
    });
  }

  getAllPossiblePromotions(carts: CartItem[], current_promo: any): any {
    let result: any = [];
    Object.keys(this.promos).forEach((key: any, index: number) => {
      let data = this.promos[key].isValidWithoutUsingPairing(carts);
      if (data) {
        data.forEach((d: any, i: number) => {
          result.push({
            key,
            programName: this.object.name,
            description: this.promos[key].object.description,
            data: d.data,
            grand_total: d.grand_total,
            real_value: d.real_value,
            min_value: d.min_value,
            max_value: d.max_value,
            path: key + "/" + i,
            total_value: this.promos[key].total_value,
            benefit: this.promos[key].object.benefit,
            quantity_left: this.promos[key].quantity_left,
            limited_quantity: this.promos[key].limited_quantity
          });
        });
      }
    });

    return result.length > 0 ? result : null;
  }

  getProductPromotions(product: CartItem): any {
    let productPromotions: any = [];
    Object.keys(this.promos).forEach((key: any, index: number) => {
      if (!this.promos[key].isCombo()) {
        let data = this.promos[key].isValidProduct(product);
        if (data) {
          productPromotions.push({
            key,
            programKey: this.path,
            programName: this.object.name,
            description: this.promos[key].object.description,
            data: data,
            total_value: this.promos[key].total_value,
            benefit: this.promos[key].object.benefit,
            quantity_left: this.promos[key].quantity_left,
            limited_quantity: this.promos[key].limited_quantity
          });
        }
      }
    });

    return productPromotions;
  }

  getActiveCombos(): any {
    let activeCombos: any = [];
    Object.keys(this.promos).forEach((key: any, index: number) => {
      let allComboConditions = this.promos[key].getAllComboConditions();
      if (allComboConditions.length > 0) {
        let valueRange = this.promos[key].getValueRange() || {};
        let combos = allComboConditions.map((comboCondition: object) => ({
          ...valueRange,
          ...this.promos[key].object,
          productCondition: comboCondition,
          key,
          programKey: this.path,
          name: this.object.name
        }));
        activeCombos = activeCombos.concat(combos);
      }
    });

    return activeCombos;
  }

  //get active combo in store (include out of quantity combo)
  getActiveCombosIncludeOutOfQuantity(): any {
    let activeCombos: any = [];
    Object.keys(this.promos).forEach((key: any, index: number) => {
      let allComboConditions = this.promos[
        key
      ].getAllComboConditionsIncludeOutOfQuantity();
      if (allComboConditions.length > 0) {
        let valueRange = this.promos[key].getValueRange() || {};
        let combos = allComboConditions.map((comboCondition: object) => ({
          ...valueRange,
          ...this.promos[key].object,
          productCondition: comboCondition,
          key,
          programKey: this.path,
          name: this.object.name
        }));
        activeCombos = activeCombos.concat(combos);
      }
    });

    return activeCombos;
  }

  promos: any;
  dateTime: DateTime;
  object: PromoProgrammeType;
  path: string;
  applyWithOthers: boolean;

  public isActive(store_id: string, now: any, channel: string): boolean {
    return (
      (this.isValidStoreId(store_id) || this.isValidChannel(channel)) &&
      DateTimeValidator.validate(this.dateTime, now)
    );
  }

  public checkCanApplyWithOthers(expected: boolean) {
    return (
      (this.applyWithOthers && expected) || (!this.applyWithOthers && !expected)
    );
  }

  public isValidStoreId(store_id: string): boolean {
    if (!store_id) return false;

    return (
      !this.object.branches || this.object.branches.indexOf(store_id) !== -1
    );
  }

  public isValidChannel(channel: string): boolean {
    if (!channel || !this.object.channels) return false;

    return this.object.channels.indexOf(channel) !== -1;
  }

  public get name(): string {
    return this.object.name;
  }

  public get description(): string {
    return this.object.description;
  }

  public get branches(): string[] | null {
    return this.object.branches;
  }
}
