const Validator = require('../Validator');

class SongsValidator extends Validator {
  constructor(songSchema) {
    super(songSchema);
  }
}

module.exports = SongsValidator;
