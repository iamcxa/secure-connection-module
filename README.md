# secure-connection-module

<!-- descriptions, main goal to deal with -->
前後端加解密用模組。

## Releated Repo

<!-- where is your server repo -->

實作前後端模擬真實環境用POC -
[secure-env-poc ](https://github.com/iamcxa/secure-env-poc)

## Getting Started

### Installation
<!-- TODO -->
```bash
# Installation
$ npm install

# testing
$ npm run test

```
## Usage

<!-- how to install or build your project -->

```JavaScript
// Init with RSA-1024 public key API
const connection = await Connection.getInstance(url);

// Base get/delete
const userData = await connection.get(url);

// post/put with partial encryption
let postBody = { Account: 'test' ,Password: 'test' };
let postOption = { encrypt: ['Password'] }; //option style same as axios
const response = await connection.post(url, postBody, postOption);

//ppost/put with fully encryption
let postBody = { Account: 'test' ,Password: 'test' };
let postOption = { encrypt: 'all' };  //option style same as axios
const response = await connection.post(url, postBody, postOption);
```

<!-- ## Limits-->

<!-- limitation of this POC -->
## References

[axios](https://github.com/axios/axios) - 0.18.0  
[cryptico-js](https://github.com/wwwtyro/cryptico) - 1.1.0

### License

<!-- ## Notes ==>

<!-- anything should be note-->

<!-- - Shoule notice the... -->

## References

<!-- what is related your project -->

- [A Reference](https://nodejs.org/)

## TODO

- [ ] add code testing coverage report
- [ ] add auto reporting after every test runs
- [ ] add github stickers for coverage and contributors
- [ ] add build tools that could transform es6 to commonjs(to dist)
