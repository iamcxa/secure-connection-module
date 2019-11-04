/* ---------------------------------------------
 Before start test,
 It must set config first and be sure your env/back-end is running.
----------------------------------------------- */
import Connection from '../src/connection';
import config from './config.js';

test('import config', () => {
  expect(config).not.toBe(null);
});

test('import connection module', () => {
  expect(Connection).not.toBe(null);
});
