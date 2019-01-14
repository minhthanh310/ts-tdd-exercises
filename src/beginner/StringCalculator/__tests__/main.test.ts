import { calculate, getDelimiters } from '../main';

test('Empty string should return zero', () => {
  let val = calculate('');
  expect(val).toBe(0);
});

test('A single number should return the value', () => {
  let val = calculate('20');
  expect(val).toBe(20);
});

test('Negative numbers throw an exception', () => {
  expect(() => {
    calculate('-55');
  }).toThrowError();
});

test('Numbers greater than 1000 are ignored', () => {
  let val = calculate('1001');
  expect(val).toBe(0);
});

test('Two numbers, comma delimited, returns the sum', () => {
  let val = calculate('10,20');
  expect(val).toBe(30);
});

test('Two numbers, newline delimited, returns the sum', () => {
  let val = calculate('20\n30');
  expect(val).toBe(50);
});

test('Three numbers, delimited either way, returns the sum', () => {
  let val = calculate('1,5,9');
  expect(val).toBe(15);

  val = calculate('1\n5,9');
  expect(val).toBe(15);

  val = calculate('1\n5\n9');
  expect(val).toBe(15);

  val = calculate('1,5\n9');
  expect(val).toBe(15);
});

test('A single char delimiter can be defined on the first line (e.g. //# for a ‘#’ as the delimiter)', () => {
  let delimiters = getDelimiters('//#\n');
  expect(delimiters).toEqual(['#']);
});

test('A multi char delimiter can be defined on the first line (e.g. //[###] for ‘###’ as the delimiter)', () => {
  let delimiters = getDelimiters('//[###]\n');
  expect(delimiters).toEqual(['###']);
});
