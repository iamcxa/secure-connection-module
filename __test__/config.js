const config = {
  base_url: 'https://localhost:5001',
  public_key: '/api/Encrypt'
};

export default {
  GetPublicKeyAPI: config.base_url + config.public_key
};
