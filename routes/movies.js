const router = require('express').Router();
const {
  getMovies, createMovie, delByMovie,
} = require('../controllers/movies');

const {
  validationCreateMovie,
  validationMovieId,
} = require('../middlewares/validators/movieValidation');

router.get('/', getMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationMovieId, delByMovie);

module.exports = router;
