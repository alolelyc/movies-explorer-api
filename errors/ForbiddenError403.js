const { ERR_STATUS_FORBIDDEN_403 } = require('../utils/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_STATUS_FORBIDDEN_403;
  }
}

module.exports = ForbiddenError;
