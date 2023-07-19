const { ERR_STATUS_CONFLICT_409 } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_STATUS_CONFLICT_409;
  }
}

module.exports = ConflictError;
