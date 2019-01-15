import { calculate, getDelimiters, ParseResult, parseInput } from '../main';

test('Empty string should return zero', () => {
  let val = calculate('', [',', '\n']);
  expect(val).toBe(0);
});

test('A single number should return the value', () => {
  let val = calculate('20', [',', '\n']);
  expect(val).toBe(20);
});

test('Negative numbers throw an exception', () => {
  expect(() => {
    calculate('-55', [',', '\n']);
  }).toThrowError();
});

test('Numbers greater than 1000 are ignored', () => {
  let val = calculate('1001', [',', '\n']);
  expect(val).toBe(0);
});

test('Two numbers, comma delimited, returns the sum', () => {
  let val = calculate('10,20', [',', '\n']);
  expect(val).toBe(30);
});

test('Two numbers, newline delimited, returns the sum', () => {
  let val = calculate('20\n30', [',', '\n']);
  expect(val).toBe(50);
});

test('Three numbers, delimited either way, returns the sum', () => {
  let val = calculate('1,5,9', [',', '\n']);
  expect(val).toBe(15);

  val = calculate('1\n5,9', [',', '\n']);
  expect(val).toBe(15);

  val = calculate('1\n5\n9', [',', '\n']);
  expect(val).toBe(15);

  val = calculate('1,5\n9', [',', '\n']);
  expect(val).toBe(15);
});

test('A single char delimiter can be defined on the first line (e.g. //# for a ‘#’ as the delimiter)', () => {
  let delimiters = getDelimiters('#');
  expect(delimiters).toEqual(['#']);
});

test('A multi char delimiter can be defined on the first line (e.g. //[###] for ‘###’ as the delimiter)', () => {
  let delimiters = getDelimiters('[###]');
  expect(delimiters).toEqual(['###']);
});

test('With input //[[[] then ‘[[’ should be a delimiter', () => {
  let delimiters = getDelimiters('[[[]');
  expect(delimiters).toEqual(['[[']);
});

test('Many single or multi-char delimiters can be defined (each wrapped in square brackets)', () => {
  let delimiters = getDelimiters('[##][#][&&&][=]');
  expect(delimiters).toEqual(['##', '#', '&&&', '=']);
});

test('Should separate delimiters definition and string correctly', () => {
  let res: ParseResult = parseInput('//#\n123,45\n');
  expect(res.valid).toBe(true);
  expect(res.delimitersDefinition).toBe('#');
  expect(res.content).toBe('123,45\n');
});

test('Should correctly calculate string //#\n123#45#6', () => {
  let res: ParseResult = parseInput('//#\n123#45#6');
  expect(res.valid).toBe(true);
  let delimiters = getDelimiters(res.delimitersDefinition);
  let val = calculate(res.content, delimiters);
  expect(val).toBe(174);
});

test('Should correctly calculate string //[&&&]\n123&&&45&&&6', () => {
  let res: ParseResult = parseInput('//[&&&]\n123&&&45&&&6');
  expect(res.valid).toBe(true);
  let delimiters = getDelimiters(res.delimitersDefinition);
  let val = calculate(res.content, delimiters);
  expect(val).toBe(174);
});

test('Should correctly calculate string //[&&&][#]\n123&&&45#6', () => {
  let res: ParseResult = parseInput('//[&&&][#]\n123&&&45#6');
  expect(res.valid).toBe(true);
  let delimiters = getDelimiters(res.delimitersDefinition);
  let val = calculate(res.content, delimiters);
  expect(val).toBe(174);
});
