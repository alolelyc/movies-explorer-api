const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const isEmail = require('validator/lib/isEmail');

const UnauthorizedError = require('../errors/UnauthorizedError401');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      //default: 'Жак-Ив Кусто',
    },
      email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Введен некорректый адрес электронной почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Введены неккоректные данные почты или пароля'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Введены неккоректные данные почты или пароля'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
