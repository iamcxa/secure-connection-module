import config from './config.js';

test('jest base test', ()=>{
  console.log(config.GetPublicKeyAPI);
  expect(config).not.toBe(null);
});
