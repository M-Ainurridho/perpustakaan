module.exports.SuccessResponse = (msg, result, res) => {
   res.status(200).json({
      status: true,
      statusCode: 200,
      msg: "Wohoo! " + msg,
      data: {
         result,
      },
   });
};

module.exports.NotFound = (res) => {
   res.status(404).json({
      status: false,
      statusCode: 404,
      msg: "Data / Item Not Found",
   });
};

module.exports.Found = (msg, res) => {
   res.status(302).json({
      status: false,
      statusCode: 302,
      msg: "Failed! " + msg,
   });
};

module.exports.BadRequest = (errors, res) => {
   res.status(400).json({
      status: false,
      statusCode: 400,
      msg: "Bad Request",
      errors,
   });
};

module.exports.InternalServerError = (res) => {
   res.status(500).json({
      status: false,
      statusCode: 500,
      msg: "Internal Server Error",
   });
};
