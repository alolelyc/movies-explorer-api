const { ValidationError, CastError } = require('mongoose').Error;
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequest400');
const NotFoundError = require('../errors/NotFoundError404');
const ForbiddenError = require('../errors/ForbiddenError403');

const {
  ERR_STATUS_CREATED_201,

} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const { _id: userId } = req.user;
  Movie.find({ owner: userId })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    nameRU,
    nameEN,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;

  const { _id: userId } = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    nameRU,
    nameEN,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(ERR_STATUS_CREATED_201).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Некорректные данные при создании новой карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.delByMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id: userId } = req.user;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('По указанному id карточка не найдена'));
      }
      if (movie.owner.toString() !== userId) {
        next(new ForbiddenError('У Вас отстутствуют права на удаление этой карточки'));
      }
      return Movie.findByIdAndRemove(movieId)
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Id пользователя передан некорректно'));
      } else {
        next(err);
      }
    });
};
