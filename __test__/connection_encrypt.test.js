/* ---------------------------------------------
 Before start test,
 It must set config first and be sure your env/back-end is running.

Testing for module encryption (RSA-1024) algorithm must same as back-end.
----------------------------------------------- */
import Connection from '../src/connection';
import config from './config.js';

test('initialization.', async () => {
  expect(config).not.toBe(null);
  expect(Connection).not.toBe(null);

  let getPublicKeyApi = config.GetPublicKeyAPI;
  let ignoreSSL = config.ignoreSSL;

  let connection = await Connection.getInstance(getPublicKeyApi, ignoreSSL);
  expect(connection).not.toBe(null);

  let publicKey = connection.getPublicKey();
  expect(publicKey).not.toBe(null);
  expect(publicKey).not.toBe('');
});

// random string
function randomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

test('test encrypt by module', async () => {
  let text = randomString();
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);

  let cipherText = connection.encrypt(text);
  expect(cipherText).not.toBe(null);
  expect(cipherText).not.toBe('');
  expect(cipherText).not.toBe(text);
});

test('test encrypt by module and decrypt by api', async ()=>{
  let text = randomString();
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);
  let cipherText = connection.encrypt(text);

  let response = await connection.post(config.Decrypt, { text: cipherText });
  expect(response).not.toBe(null);
  expect(response.state).toBe(true);

  let decipherText = response.data;
  expect(decipherText).not.toBe(null);
  expect(decipherText).not.toBe('');

  expect(decipherText).toBe(text);
});

test('test encrypt  by api and decrypt by api', async ()=>{
  let text = randomString();
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);

  let response = await connection.post(config.Encrypt, { text });
  expect(response).not.toBe(null);
  expect(response.state).toBe(true);

  let cipherText = response.data;
  expect(cipherText).not.toBe(null);
  expect(cipherText).not.toBe('');
  expect(cipherText).not.toBe(text);

  let response2 = await connection.post(config.Decrypt, { text: cipherText });
  expect(response2).not.toBe(null);
  expect(response2.state).toBe(true);

  let decipherText = response2.data;
  expect(decipherText).not.toBe(null);
  expect(decipherText).not.toBe('');

  expect(decipherText).toBe(text);
});
