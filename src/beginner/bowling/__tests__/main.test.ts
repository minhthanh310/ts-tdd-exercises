import { main } from '../main';

test('main return 1', () => {
  expect(main('any string')).toBe(1);
});
