const { ERR_STATUS_INTERNAL_SERVER_500 } = require('../utils/constants');

module.exports.handlerCentrError = (err, req, res, next) => {
  const { statusCode = ERR_STATUS_INTERNAL_SERVER_500, message } = err;
  res.status(statusCode).send({ message: statusCode === ERR_STATUS_INTERNAL_SERVER_500 ? 'На сервере произошла ошибка' : message });
  next();
};
