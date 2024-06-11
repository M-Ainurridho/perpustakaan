const connection = require("../config/db");

module.exports.sql = (query) => {
   return new Promise((resolve, reject) => {
      connection.query(query, (err, rows) => {
         if (err) reject(err);

         resolve(rows);
      });
   });
};
