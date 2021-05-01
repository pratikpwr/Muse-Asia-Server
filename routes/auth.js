const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

// POST /auth/signup
router.post(
  "/signup",
  [
    body("name").trim().notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please Enter valid Email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 6 }),
  ],
  authController.signUp
);

router.put(
  "/signin",
  [
    body("email").isEmail().withMessage("Please Enter valid Email!"),
    body("password").trim().isLength({ min: 6 }),
  ],
  authController.signIn
);

module.exports = router;
