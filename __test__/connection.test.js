import connection from '../src/connection';

test('import connection success', () => {
  expect(connection).not.toBe(null);
});
