const config = {
  // fix ssl unauthorize issue for node js.
  ignoreSSL: true,
  // api list
  base_url: 'https://localhost:5001',
  public_key: '/api/Encrypt',
  encrypt: '/api/Encrypt/Encrypt',
  decrypt: '/api/Encrypt/Decrypt',
  user_list: '/api/User',
  user_create: '/api/User',
  user_get: '/api/User/',
  user_update: '/api/User/',
  user_delete: '/api/User/',
  user_create_encrypt: '/api/EncryptUser',
  user_update_encrypt: '/api/EncryptUser/'
};

export default {
  ignoreSSL: config.ignoreSSL,
  GetPublicKeyAPI: config.base_url + config.public_key,
  Encrypt: config.base_url + config.encrypt,
  Decrypt: config.base_url + config.decrypt,
  User_List: config.base_url + config.user_list,
  User_Create: config.base_url + config.user_create,
  User_Get: (SN) => config.base_url + config.user_get + SN,
  User_Update: (SN) => config.base_url + config.user_update + SN,
  User_Delete: (SN) => config.base_url + config.user_delete + SN,
  User_Create_Encrypt: config.base_url + config.user_create_encrypt,
  User_Update_Encrypt: (SN) => config.base_url + config.user_update_encrypt + SN
};
