const { body, validationResult } = require("express-validator");
const { BadRequest, NotFound } = require("../response");
const { searchMember } = require("../models/auth-model");
const jwt = require("jsonwebtoken");

// Login account validation
module.exports.loginValidation = [
   body("username").trim().notEmpty().withMessage("Field username cant't be empty"),
   body("password").trim().notEmpty().withMessage("Field password cant't be empty"),
   (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return BadRequest(errors.array(), res);
      }

      next();
   },
];

// Register account validation
module.exports.registerValidation = [
   body("fullname").trim().notEmpty().withMessage("Field fullname cant't be empty"),
   body("username")
      .trim()
      .notEmpty()
      .withMessage("Field username cant't be empty")
      .custom(async (value) => {
         const exist = await searchMember(value);

         if (exist !== undefined) {
            throw new Error("Username already exist (strict)");
         }
      }),
   body("password").trim().notEmpty().withMessage("Field password cant't be empty").isLength({ min: 8 }).withMessage("Password too short"),
   body("age").trim().notEmpty().withMessage("Field age cant't be empty"),
   body("gender").trim().notEmpty().withMessage("Field gender cant't be empty"),
   body("address").trim().notEmpty().withMessage("Field address cant't be empty"),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return BadRequest(errors.array(), res);
      }

      next();
   },
];

// Exchange token validation
module.exports.tokenValidation = (req, res, next) => {
   const token = req.body.token;

   if (!token) {
      return NotFound(res);
   }

   try {
      const decoded = jwt.verify(token, "wadidaww");
      req.memberId = decoded.id;

      next();
   } catch (err) {
      return BadRequest([{ value: token, path: "token", msg: "Invalid token" }], res);
   }
};

// New & Update book validation
module.exports.addAndUpdateBookValidation = [
   body("categoryId").trim().notEmpty().withMessage("Field category cant't be empty"),
   body("title").trim().notEmpty().withMessage("Field title cant't be empty"),
   body("author").trim().notEmpty().withMessage("Field author cant't be empty"),
   body("publisher").trim().notEmpty().withMessage("Field publisher cant't be empty"),
   body("publishYear").trim().notEmpty().withMessage("Field publish year cant't be empty"),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return BadRequest(errors.array(), res);
      }

      next();
   },
];

// Loan a book
module.exports.bookLoanValidation = [
   body("loanTime").trim().notEmpty().withMessage("Field loan time cant't be empty"),
   body("lengthOfLoan").trim().notEmpty().withMessage("Field length of loan cant't be empty"),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return BadRequest(errors.array(), res);
      }

      next();
   },
];

module.exports.bookReturnValidation = [
   body("returnTime").trim().notEmpty().withMessage("Field return time cant't be empty"),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return BadRequest(errors.array(), res);
      }

      next();
   },
];
