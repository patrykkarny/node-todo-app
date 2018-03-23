import mongoose from 'mongoose';
import { isEmail } from 'validator';
import { sign, verify } from 'jsonwebtoken';
import pick from 'lodash/pick';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: isEmail,
      message: '{VALUE} email is not a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
});

UserSchema.methods.toJSON = function toJSON() {
  const user = this;
  const userObject = user.toObject();

  return pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function generateAuthToken() {
  const user = this;
  const access = 'auth';
  const token = sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();

  user.tokens = [
    ...user.tokens,
    { access, token },
  ];

  return user.save().then(() => token);
};

UserSchema.methods.removeToken = function removeToken(token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {
        token,
      },
    },
  });
};

UserSchema.statics.findByToken = function findByToken(token) {
  const User = this;
  let decoded;

  try {
    decoded = verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = function findByCredentials({ email, password }) {
  const User = this;

  return User.findOne({ email })
    .then((user) => {
      if (!user) return Promise.reject();

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, success) => (
          success ? resolve(user) : reject()
        ));
      });
    });
};

UserSchema.pre('save', function save(next) {
  const user = this;

  return (
    user.isModified('password')
      ? (
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (e, hash) => {
            user.password = hash;

            next();
          });
        })
      )
      : next()
  );
});

export const User = mongoose.model('User', UserSchema);
