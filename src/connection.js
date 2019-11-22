import axios from 'axios';
import cryptico, { RSAKey } from 'cryptico-js';
import https from 'https';

async function AxiosGet(url, config, OnSuccess, OnFailed) {
  await axios
    .get(url, config)
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFailed && typeof OnFailed === 'function') {
        await OnFailed(err);
      }
    });
}

async function AxiosDelete(url, config, OnSuccess, OnFailed) {
  await axios
    .delete(url, config)
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFailed && typeof OnFailed === 'function') {
        await OnFailed(err);
      }
    });
}

async function AxiosPost(url, data, config, OnSuccess, OnFailed) {
  await axios
    .post(url, data, config)
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFailed && typeof OnFailed === 'function') {
        await OnFailed(err);
      }
    });
}

async function AxiosPut(url, data, config, OnSuccess, OnFailed) {
  await axios
    .put(url, data, config)
    .then(async (res) => {
      if (OnSuccess && typeof OnSuccess === 'function') {
        await OnSuccess(res.data);
      }
    })
    .catch(async (err) => {
      if (OnFailed && typeof OnFailed === 'function') {
        await OnFailed(err);
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
  static async getInstance(url, ignoreSSL = false) {
    let module = null;
    let agent = new https.Agent({
      rejectUnauthorized: !ignoreSSL,
    });
    await AxiosGet(url, { httpsAgent: agent }, (res) => {
      module = new ConnectionModule(res.data, ignoreSSL);
    });
    return module;
  }

  constructor(publicKey, ignoreSSL = false) {
    this.rejectUnauthorized = !ignoreSSL;
    this.publicKey = publicKey;
  }

  agent() {
    return new https.Agent({
      rejectUnauthorized: this.rejectUnauthorized,
    });
  }

  getPublicKey() {
    return this.publicKey;
  }

  encrypt(str) {
    return RSAEncrypt(this.publicKey, str);
  }

  encryptPostData(postBody, postOption) {
    if (
      postOption.encrypt &&
      typeof postOption.encrypt === 'string' &&
      postOption.encrypt === 'all'
    ) {
      return { data: RSAEncrypt(this.publicKey, JSON.stringify(postBody)) };
    }
    if (
      postOption.encrypt &&
      typeof postOption.encrypt === 'object' &&
      Array.isArray(postOption.encrypt)
    ) {
      let Scope = [];
      let data = postBody;
      for (let i = 0; i < postOption.encrypt.length; i += 1) {
        if (data[postOption.encrypt[i]]) {
          data[postOption.encrypt[i]] = RSAEncrypt(
            this.publicKey,
            data[postOption.encrypt[i]],
          );
          Scope.push(postOption.encrypt[i]);
        }
      }
      return {
        data: data,
        Scope: Scope,
      };
    }
    return postBody;
  }

  async get(url, config) {
    let response = null;
    let postConfig = { ...config };
    postConfig.httpsAgent = this.agent();
    await AxiosGet(url, postConfig, async (res) => {
      response = res;
    });
    return response;
  }

  async post(url, body, config) {
    let response = null;
    let postConfig = { ...config };
    let postBody = this.encryptPostData(body, postConfig);
    if (postConfig.encrypt) {
      delete postConfig.encrypt;
    }
    postConfig.httpsAgent = this.agent();
    await AxiosPost(url, postBody, postConfig, (res) => {
      response = res;
    });
    return response;
  }

  async put(url, body, option) {
    let response = null;
    let postConfig = { ...option };
    let postBody = this.encryptPostData(body, postConfig);
    if (postConfig.encrypt) {
      delete postConfig.encrypt;
    }
    postConfig.httpsAgent = this.agent();
    await AxiosPut(url, postBody, postConfig, (res) => {
      response = res;
    });
    return response;
  }

  async delete(url, config) {
    let response = null;
    let postConfig = { ...config };
    postConfig.httpsAgent = this.agent();
    await AxiosDelete(url, postConfig, (res) => {
      response = res;
    });
    return response;
  }
}

export default ConnectionModule;
