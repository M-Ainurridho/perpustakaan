var mysql = require("mysql");
var connection = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database: "perpustakaan",
});

connection.connect(function (err) {
   if (err) {
      console.error("error connecting: " + err.stack);
      return;
   }

   console.log("Connected to MySQL");
});

module.exports = connection;
