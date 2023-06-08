const { ERR_STATUS_BAD_REQUEST_400 } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_STATUS_BAD_REQUEST_400;
  }
}

module.exports = BadRequestError;
