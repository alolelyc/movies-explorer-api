const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError401');

const JWT_SECRET = require('../utils/config');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Некорректный токен'));
  }
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
