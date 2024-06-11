const bcrypt = require("bcrypt");

module.exports.generatePassword = (password) => {
   const saltRounds = 10;

   const hash = bcrypt.hashSync(password, saltRounds);
   return hash;
};

module.exports.checkPassword = (password, hash) => {
   const check = bcrypt.compareSync(password, hash);
   console.log(check);
   return check;
};
