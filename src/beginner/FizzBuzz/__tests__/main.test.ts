import { main } from '../main';

test('Should print: 1 2 Fizz 4', () => {
  let ret = main(4);
  expect(ret).toBe('1 2 Fizz 4');
});

test('Should print: 1 2 Fizz 4 Buzz', () => {
  let ret = main(5);
  expect(ret).toBe('1 2 Fizz 4 Buzz');
});

test('Should print: 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz', () => {
  let ret = main(15);
  expect(ret).toBe('1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz');
});

test('Should start at 1 and end at 100', () => {
  let ret = main(101);
  let last3Chars = ret.slice(ret.length - 3);
  expect(last3Chars).not.toBe('101');
});

test('Should end with: ...Buzz Fizz 97 98 Fizz Buzz', () => {
  let ret = main(100);
  let correctEnd = 'Buzz Fizz 97 98 Fizz Buzz';
  let actualEnd = ret.slice(ret.length - correctEnd.length);
  expect(actualEnd).toBe(correctEnd);
});

test('Should have: ...41 Fizz 43 44 FizzBuzz 46 47 Fizz...', () => {
  let ret = main(100);
  let startIndex = ret.indexOf('41');
  let correctString = '41 Fizz 43 44 FizzBuzz 46 47 Fizz';
  let actualString = ret.slice(startIndex, startIndex + correctString.length);
  expect(actualString).toBe(correctString);
});
