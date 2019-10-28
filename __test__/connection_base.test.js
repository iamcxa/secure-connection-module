/* ---------------------------------------------
 Before start test,
 It must set config first and be sure your env/back-end is running.
----------------------------------------------- */
import connection from '../src/connection';
import config from './config.js';

test('import config', () => {
  // console.log(config.GetPublicKeyAPI);
  expect(config).not.toBe(null);
});

test('import connection module', () => {
  expect(connection).not.toBe(null);
});
