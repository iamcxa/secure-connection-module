import axios from "axios";
import { RSAKey } from "cryptico-js";
import cryptico from "cryptico-js";

//axios
var axios_get = async function(url, query, OnSuccess, OnFaild) {
  //var headers = { 'Authorization': 'Basic ...' };
  var headers = {};
  await axios
    .get(url, { headers: headers, params: query })
    .then(async function(res) {
      if (OnSuccess && typeof OnSuccess === "function") {
        await OnSuccess(res.data);
      }
    })
    .catch(async function(err) {
      if (OnFaild && typeof OnFaild === "function") {
        await OnFaild(err);
      }
    });
};

var axios_delete = async function(url, query, OnSuccess, OnFaild) {
  //var headers = { 'Authorization': 'Basic ...' };
  var headers = {};
  await axios
    .delete(url, { headers: headers, params: query })
    .then(async function(res) {
      if (OnSuccess && typeof OnSuccess === "function") {
        await OnSuccess(res.data);
      }
    })
    .catch(async function(err) {
      if (OnFaild && typeof OnFaild === "function") {
        await OnFaild(err);
      }
    });
};
var axios_post = async function(url, data, query, OnSuccess, OnFaild) {
  var headers = {};
  await axios
    .post(url, data, { headers: headers, params: query })
    .then(async function(res) {
      if (OnSuccess && typeof OnSuccess === "function") {
        await OnSuccess(res.data);
      }
    })
    .catch(async function(err) {
      if (OnFaild && typeof OnFaild === "function") {
        await OnFaild(err);
      }
    });
};

var axios_put = async function(url, data, query, OnSuccess, OnFaild) {
  var headers = {};
  await axios
    .put(url, data, { headers: headers, params: query })
    .then(async function(res) {
      if (OnSuccess && typeof OnSuccess === "function") {
        await OnSuccess(res.data);
      }
    })
    .catch(async function(err) {
      if (OnFaild && typeof OnFaild === "function") {
        await OnFaild(err);
      }
    });
};

//crypt
const crypt = {
  RSA_Encrypt: function(publicKey, plaintext) {
    var cipherblock = "";
    var N = cryptico.b64to16(publicKey.N);
    var E = cryptico.b64to16(publicKey.E);
    var publickey = new RSAKey();
    publickey.setPublic(N, E);
    try {
      cipherblock += cryptico.b16to64(publickey.encrypt(plaintext));
    } catch (err) {
      return "";
    }
    return cipherblock;
  }
};

//module
class ConnectionModule {
  static async getInstance(url) {
    var module = null;
    await axios_get(url, null, res => {
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
    return crypt.RSA_Encrypt(this.publicKey, str);
  }

  encryptPostData(postBody, postOption) {
    if (
      postOption.encrypt &&
      typeof postOption.encrypt == "string" &&
      postOption.encrypt == "all"
    ) {
      var jsonString = JSON.stringify(postBody);
      return { data: crypt.RSA_Encrypt(this.publicKey, jsonString) };
    } else if (
      postOption.encrypt &&
      typeof postOption.encrypt == "object" &&
      Array.isArray(postOption.encrypt)
    ) {
      var Scope = [];
      var data = postBody;
      for (var i = 0; i < postOption.encrypt.length; i++) {
        if (data[postOption.encrypt[i]]) {
          data[postOption.encrypt[i]] = crypt.RSA_Encrypt(
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
  }

  async get(url, postQuery) {
    var response = null;
    await axios_get(url, postQuery, res => {
      response = res;
    });
    return response;
  }

  async post(url, postBody, postOption) {
    var encryptPostBody = this.encryptPostData(postBody, postOption);
    if (postOption.encrypt) delete postOption.encrypt;

    var response = null;
    await axios_post(url, encryptPostBody, postOption, res => {
      response = res;
    });
    return response;
  }

  async put(url, postBody, postOption) {
    var encryptPostBody = this.encryptPostData(postBody, postOption);
    if (postOption.encrypt) delete postOption.encrypt;

    var response = null;
    await axios_put(url, encryptPostBody, postOption, res => {
      response = res;
    });
    return response;
  }

  async delete(url, postQuery) {
    var response = null;
    await axios_delete(url, postQuery, res => {
      response = res;
    });
    return response;
  }
}
export default ConnectionModule;
