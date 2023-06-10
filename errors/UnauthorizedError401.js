const { ERR_STATUS_UNAUTHORIZED_401 } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_STATUS_UNAUTHORIZED_401;
  }
}

module.exports = UnauthorizedError;
