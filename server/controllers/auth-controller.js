const path = require("path");
const { randomImage } = require("../utils/random");
const { generatePassword, checkPassword } = require("../utils/hash");
const { response } = require("../response");
const { insertMember, searchMember, findMemberById } = require("../models/auth-model");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

const extensionPermitted = [".jpg", ".jpeg", ".png"];

const loginAccount = async (req, res) => {
   try {
      let { username, password } = req.body;

      // check member by username
      const member = await searchMember(username);
      if (member === undefined) {
         return response(400, "Bad Request", res, [{ value: username, msg: "Username doesn't exist", path: "username" }]);
      }

      // check password
      const isCorrectPassword = checkPassword(password, member.password);
      if (!isCorrectPassword) {
         return response(400, "Bad Request", res, [{ value: password, msg: "Password wrong", path: "password" }]);
      }

      jwt.sign(
         {
            id: member.id,
         },
         "wadidaww",
         { expiresIn: 60 * 60 * 24 },
         (err, token) => {
            if (err) return response(400, "Bad Request", res, [{ path: "password", msg: "Failed generate token" }]);

            return response(200, "Wohoo! Successfuly generate token", res, token);
         }
      );
   } catch (err) {
      return response(500, "Internal Server Error", res);
   }
};

const registerAccount = (req, res) => {
   let { password, gender } = req.body;

   let image = randomImage(gender.toLowerCase());

   if (!extensionPermitted.includes(path.extname(image))) {
      return response(404, "Not Found", res, [{ path: "gender", msg: image }]);
   }

   password = generatePassword(password);
   return insertMember({ ...req.body, password, image }, res);
};

const exchangeToken = async (req, res) => {
   try {
      const member = await findMemberById(req.memberId);
      if (member.length > 0) {
         return response(200, "Wohoo! Successfuly exchange token", res, member[0]);
      }

      return response(404, "Not Found", res, [{ path: token, msg: "Member not found" }]);
   } catch (err) {
      return response(500, "Internal Server Error", res);
   }
};

module.exports = { loginAccount, registerAccount, exchangeToken };
