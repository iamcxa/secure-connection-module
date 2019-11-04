/* ---------------------------------------------
 Before start test,
 It must set config first and be sure your env/back-end is running.
----------------------------------------------- */
import Connection from '../src/connection';
import config from './config.js';
var createdUserSN = null;
function randomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
test('user list', async () => {
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);
  let response = await connection.get(config.User_List);
  expect(response).not.toBe(null);
  expect(response.state).toBe(true);
  // test if user list is array
  let userList = response.data;
  expect(Array.isArray(userList)).toBe(true);
});

test('user get', async () =>{
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);
  let response = await connection.get(config.User_List);
  // get first user sn.
  let userList = response.data;
  expect(userList.length).toBeGreaterThanOrEqual(1);
  let sn = response.data[0].SN;
  let account = response.data[0].Account;

  // get user fata by sn and check if user data is correct.
  let response2 = await connection.get(config.User_Get(sn));
  expect(response2).not.toBe(null);
  expect(response2.state).toBe(true);
  let userData = response2.data;
  let targetSN = userData.SN;
  let targetAccount = userData.Account;
  expect(targetSN).toBe(sn);
  expect(targetAccount).toBe(account);
});

test('user create with full encrypt mode', async ()=>{
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);
  let newUserName = randomString();
  let newUser = {
    Account: 'Account',
    Password: 'password',
    Name: newUserName,
    Email: 'Email',
    Telephone: 'Telephone'
  };
  let encryptConfig = {
    encrypt: 'all'
  };
  let response = await connection.put(config.User_Create_Encrypt, newUser, encryptConfig);
  expect(response).not.toBe(null);
  expect(response.state).toBe(true);

  let response2 = await connection.get(config.User_List);
  let userList = response2.data;
  let newUserExist = false;
  for (let i = 0; i < userList.length; i += 1) {
    let user = userList[i];
    if (user.Name === newUserName) {
      createdUserSN = user.SN;
      newUserExist = true;
      break;
    }
  }

  expect(newUserExist).toBe(true);
});

test('user update with partial encrypt mode', async () =>{
  // use the created userSN
  expect(createdUserSN).not.toBe(null);
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);
  let newUserTelephone = randomString();

  let response = await connection.get(config.User_Get(createdUserSN));
  let userData = response.data;

  let updateUserData = {
    Name: userData.Name,
    Email: userData.Email,
    Telephone: newUserTelephone
  };
  let encryptConfig = {
    encrypt: ['Telephone']
  };
  let response2 = await connection.post(config.User_Update_Encrypt(createdUserSN),
    updateUserData, encryptConfig);
  expect(response2).not.toBe(null);
  expect(response2.state).toBe(true);

  let response3 = await connection.get(config.User_Get(createdUserSN));
  let updatedUserData = response3.data;
  expect(updatedUserData).not.toBe(null);
  expect(updatedUserData.Telephone).toBe(newUserTelephone);
});

test('user delete', async () =>{
  let connection = await Connection.getInstance(config.GetPublicKeyAPI, config.ignoreSSL);
  let response = await connection.delete(config.User_Delete(createdUserSN));
  expect(response).not.toBe(null);
  expect(response.state).toBe(true);

  let response2 = await connection.get(config.User_List);
  let userList = response2.data;
  let userExist = false;
  for (let i = 0; i < userList.length; i += 1) {
    let user = userList[i];
    if (user.SN === createdUserSN) {
      userExist = true;
      break;
    }
  }

  expect(userExist).toBe(false);
});
