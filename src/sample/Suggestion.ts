export class Suggestion {
  constructor() {
    this.m_suggestion = [];
  }

  add(data: any[]) {
    let newSuggest = new Suggest(data);
    // console.log('Add new suggest data: ', JSON.stringify(data));
    this.m_suggestion.push(newSuggest);
  }

  getBest(): Suggest {
    let best = this.m_suggestion[0];

    this.m_suggestion.forEach(suggest => {
      if (suggest.value > best.value) best = suggest;
    });

    return best;
  }

  m_suggestion: Suggest[];
}

export class Suggest {
  constructor(data: any[]) {
    this.m_data = data;
    this.m_value = this.calculateValue();
  }

  calculateValue(): number {
    let total = 0;
    this.m_data.forEach((d: any) => {
      total += d.total_value * d.quantity;
    });
    return total;
  }

  public get value(): number {
    return this.m_value;
  }

  public get data(): any[] {
    return this.m_data;
  }

  m_value: number;
  m_data: any[];
}
