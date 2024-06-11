const router = require("express").Router();

router.get("/", (req, res, next) => {
   res.json({
      status: true,
      defaultRoute: "/",
      message: "Selamat datang di API Peminjaman Buku",
   });
});

// v1
const authRoute = require("./auth-route");
const libraryRoute = require("./library-route");

router.use("/v1/auth", authRoute);
router.use("/v1/library", libraryRoute);

module.exports = router;
