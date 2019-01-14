export function main(upperLimit: number): String {
  let ret = '';
  upperLimit = upperLimit > 100 ? 100 : upperLimit;

  for (let i: number = 1; i <= upperLimit; i++) {
    if (i > 1) {
      ret += ' ';
    }
    if (i % 15 === 0) {
      ret += 'FizzBuzz';
    } else if (i % 3 === 0) {
      ret += 'Fizz';
    } else if (i % 5 === 0) {
      ret += 'Buzz';
    } else {
      ret += `${i}`;
    }
  }

  return ret;
}
