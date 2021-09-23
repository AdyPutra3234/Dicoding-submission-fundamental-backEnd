const InVariantError = require('../exceptions/InVariantError');

class Validator {
  constructor(payloadSchema) {
    this._schema = payloadSchema;

    this.validate = this.validate.bind(this);
  }

  validate(payload) {
    const validationResult = this._schema.validate(payload);
    if (validationResult.error) throw new InVariantError(validationResult.error.message);
  }
}

module.exports = Validator;
