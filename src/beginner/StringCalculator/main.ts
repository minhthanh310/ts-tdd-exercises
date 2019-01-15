export interface ParseResult {
  valid: boolean;
  delimitersDefinition: string;
  content: string;
}

export function parseInput(input: string): ParseResult {
  let noDelimiter: ParseResult = {
    valid: true,
    delimitersDefinition: '',
    content: input
  };

  if (input === '' || input.length < 2) {
    return noDelimiter;
  }

  let hasDelimiterDefinition: boolean = input.slice(0, 2) === '//';
  if (hasDelimiterDefinition) {
    let eol: number = input.indexOf('\n');
    if (eol !== -1) {
      return {
        valid: true,
        delimitersDefinition: input.slice(2, eol),
        content: input.slice(eol + 1)
      };
    } else {
      return {
        valid: false,
        delimitersDefinition: '',
        content: ''
      };
    }
  } else {
    return noDelimiter;
  }
}

export function calculate(content: string, delimiters: Array<string>): number {
  if (content === '') {
    return 0;
  }

  let parts = splitString(content, delimiters).map(p => getNumber(p));
  return parts.reduce((sum, n) => sum + n, 0);
}

export function getDelimiters(delimitersDefinition: string): Array<string> {
  let delimiters: Array<string> = [];

  if (delimitersDefinition.length === 1) {
    delimiters.push(delimitersDefinition.charAt(0));
  } else {
    let delimiter: string = '';
    let isRecording: boolean = false;

    for (let i: number = 0; i < delimitersDefinition.length; i++) {
      let c: string = delimitersDefinition.charAt(i);
      if (c === '[' && !isRecording) {
        isRecording = true;
      } else if (c === ']' && isRecording) {
        isRecording = false;
        if (delimiter) {
          delimiters.push(delimiter);
          delimiter = '';
        }
      } else {
        if (isRecording) {
          delimiter += c;
        }
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
  let partialString: string = '';
  let metDelimiter: boolean = false;
  let inputWithPadding = `${delimiters[0]}${input}${delimiters[0]}`;

  let i: number = 0;
  while (i < inputWithPadding.length) {
    let matchedDelimiterLength = getMatchedDelimiterLength(inputWithPadding.slice(i), delimiters);
    if (matchedDelimiterLength > 0) {
      if (partialString !== '' && !metDelimiter) {
        parts.push(partialString);
        partialString = '';
      }
      metDelimiter = true;
      i += matchedDelimiterLength;
    } else {
      if (metDelimiter) {
        partialString = inputWithPadding.charAt(i);
      } else {
        partialString += inputWithPadding.charAt(i);
      }
      metDelimiter = false;
      i++;
    }
  }

  return parts;
}

function getMatchedDelimiterLength(input: string, delimiters: Array<string>): number {
  for (let d of delimiters) {
    if (d && input.slice(0, d.length) === d) {
      return d.length;
    }
  }

  return 0;
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
