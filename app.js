const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const movies = require('./routes/movies');
const users = require('./routes/users');
const limiter = require('./middlewares/limiter');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { handlerCentrError } = require('./middlewares/handlerCentrError');
const NotFoundError = require('./errors/NotFoundError404');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const {
  validationLogin,
  validationCreateUser,
} = require('./middlewares/validators/userValidation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
})
  .then(() => console.log('connected in MONGO'))
  .catch((err) => console.log(err));

app.use(helmet());
app.use(limiter);
app.use(cors);

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use('/users', auth, users);
app.use('/movies', auth, movies);
app.get('/signout', auth, logout);
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Данный URL не существует'));
});

app.use(errorLogger);
app.use(errors());
app.use(handlerCentrError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
