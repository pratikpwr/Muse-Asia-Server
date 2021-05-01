const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Enter valid data.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = User({
        email: email,
        name: name,
        password: hashedPw,
      });
      return user.save();
    })
    .then((user) => {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        "anysecretkey",
        { expiresIn: "3h" }
      );
      res.status(201).json({
        message: "User Created!",
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      catchError({ next: next, error: err });
    });
};

exports.signIn = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Enter valid data.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email id does not found!");
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Incorrect Password!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "anysecretkey",
        { expiresIn: "3h" }
      );

      res.status(200).json({
        message: "User Signed In!",
        token: token,
        user: {
          id: loadedUser._id,
          name: loadedUser.name,
          email: loadedUser.email,
        },
      });
    })
    .catch((err) => {
      catchError({ next: next, error: err });
    });
};

const catchError = ({ next, error }) => {
  if (!error.statusCode) {
    error.statusCode = 500;
    next(error);
  }
};
