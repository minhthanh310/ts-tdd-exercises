import _ from 'lodash';

export default class Combo {
  static getInstance(combo: any) {
    if (!combo) {
      return null;
    } else {
      return new Combo(combo);
    }
  }

  constructor(combo: any) {
    this.combo = combo;
  }

  isCombo(): boolean {
    return true;
  }

  getComboObject() {
    return { combo: this.combo };
  }

  combo: any;
}
