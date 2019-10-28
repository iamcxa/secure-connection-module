import axios from 'axios';
import cryptico, { RSAKey } from 'cryptico-js';

async function AxiosGet(url, query, OnSuccess, OnFaild) {
  var headers = {};
  await axios
    .get(url, { headers: headers, params: query })
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFaild && typeof OnFaild === 'function') {
        await OnFaild(err);
      }
    });
}

async function AxiosDelete(url, query, OnSuccess, OnFaild) {
  var headers = {};
  await axios
    .delete(url, { headers: headers, params: query })
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFaild && typeof OnFaild === 'function') {
        await OnFaild(err);
      }
    });
}

async function AxiosPost(url, data, query, OnSuccess, OnFaild) {
  var headers = {};
  await axios
    .post(url, data, { headers: headers, params: query })
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFaild && typeof OnFaild === 'function') {
        await OnFaild(err);
      }
    });
}

async function AxiosPut(url, data, query, OnSuccess, OnFaild) {
  var headers = {};
  await axios
    .put(url, data, { headers: headers, params: query })
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFaild && typeof OnFaild === 'function') {
        await OnFaild(err);
      }
    });
}

function RSAEncrypt(publicKey, plaintext) {
  var cipherblock = '';
  var N = cryptico.b64to16(publicKey.N);
  var E = cryptico.b64to16(publicKey.E);
  var publickey = new RSAKey();
  publickey.setPublic(N, E);
  try {
    cipherblock += cryptico.b16to64(publickey.encrypt(plaintext));
  } catch (err) {
    return '';
  }
  return cipherblock;
}

class ConnectionModule {
  static async getInstance(url) {
    var module = null;
    await AxiosGet(url, null, res => {
      module = new ConnectionModule(res.data);
    });
    return module;
  }

  constructor(publicKey) {
    this.publicKey = publicKey;
  }

  getPublicKey() {
    return this.publicKey;
  }

  encrypt(str) {
    return RSAEncrypt(this.publicKey, str);
  }

  encryptPostData(postBody, postOption) {
    if (postOption.encrypt && typeof postOption.encrypt === 'string' && postOption.encrypt === 'all') {
      return { data: RSAEncrypt(this.publicKey, JSON.stringify(postBody)) };
    }
    if (postOption.encrypt && typeof postOption.encrypt === 'object' && Array.isArray(postOption.encrypt)) {
      let Scope = [];
      let data = postBody;
      for (let i = 0; i < postOption.encrypt.length; i += 1) {
        if (data[postOption.encrypt[i]]) {
          data[postOption.encrypt[i]] = RSAEncrypt(
            this.publicKey,
            data[postOption.encrypt[i]]
          );
          Scope.push(postOption.encrypt[i]);
        }
      }
      return {
        data: data,
        Scope: Scope
      };
    }
    return postBody;
  }


  async get(url, postQuery) {
    var response = null;
    await AxiosGet(url, postQuery, res => {
      this.response = res;
    });
    return response;
  }

  async post(url, postBody, postOption) {
    var response = null;
    var option = { ...postOption };
    var body = this.encryptPostData(postBody, postOption);
    if (option.encrypt) {
      delete option.encrypt;
    }
    await AxiosPost(url, body, option, res => {
      response = res;
    });
    return response;
  }

  async put(url, postBody, postOption) {
    var response = null;
    var option = { ...postOption };
    var body = this.encryptPostData(postBody, postOption);
    if (option.encrypt) {
      delete option.encrypt;
    }
    await AxiosPut(url, body, postOption, res => {
      response = res;
    });
    return response;
  }

  async delete(url, postQuery) {
    var response = null;
    await AxiosDelete(url, postQuery, res => {
      this.response = res;
    });
    return response;
  }
}
export default ConnectionModule;
