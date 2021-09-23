const Jwt = require('@hapi/jwt');
const InVariantError = require('../exceptions/InVariantError');

class TokenManager {
  constructor() {
    this._Jwt = Jwt;
  }

  generateAccessToken(payload) {
    return this._Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  generateRefreshToken(payload) {
    return this._Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);

      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InVariantError('RefreshToken tidak valid');
    }
  }
}

module.exports = TokenManager;
