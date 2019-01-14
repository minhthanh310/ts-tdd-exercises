export function calculate(input: string): number {
  if (input === '') {
    return 0;
  }

  let parts = splitString(input, [',', '\n']).map(p => getNumber(p));
  return parts.reduce((sum, n) => sum + n, 0);
}

export function getDelimiters(input: string): Array<string> {
  let delimiters: Array<string> = [];
  let hasDelimiterDefinition: boolean = input.slice(0, 2) === '//';

  if (hasDelimiterDefinition) {
    let eol: number = input.indexOf('\n');
    if (eol !== -1) {
      let declareString = input.slice(2, eol);
      for (let i: number = 0; i < declareString.length; i++) {
        delimiters.push(declareString.charAt(i));
      }
    }
  }

  return delimiters;
}

function splitString(input: string, delimiters: Array<string>): Array<string> {
  if (!delimiters || delimiters.length === 0) {
    return [input];
  }

  let parts: Array<string> = [];
  let isRecording: boolean = false;
  let metDelimiter: boolean = false;
  let start: number = 0;
  let inputWithPadding = `${delimiters[0]}${input}${delimiters[0]}`;

  for (let i: number = 0; i < inputWithPadding.length; i++) {
    if (delimiters.some(d => d === inputWithPadding.charAt(i))) {
      if (isRecording && !metDelimiter) {
        parts.push(inputWithPadding.slice(start, i));
        isRecording = false;
      }
      metDelimiter = true;
    } else {
      if (metDelimiter) {
        isRecording = true;
        start = i;
      }
      metDelimiter = false;
    }
  }

  return parts;
}

function getNumber(str: string): number {
  let n: number = parseNumber(str);
  if (n < 0) {
    throw new Error('Negative Number Detected');
  } else if (n > 1000) {
    return 0;
  } else if (!isNaN(n)) {
    return n;
  }
}

function parseNumber(str: string): number {
  const regex = /-?[0-9]*/;
  let numbers: Array<string> = str.match(regex);
  if (!numbers || numbers.length > 1) {
    return NaN;
  } else {
    return parseInt(str);
  }
}
