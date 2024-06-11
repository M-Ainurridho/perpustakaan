const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("./config/db");

dotenv.config();
const PORT = process.env.API_PORT || 9000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const routes = require("./routes");
app.use("/", routes);

// handle error route
app.use((_, res) => {
   res.status(404).json({
      status: false,
      message: "Not Found",
   });
});

app.listen(PORT, () => {
   console.log("Server is listening at localhost:" + PORT);
});
