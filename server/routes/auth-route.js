const router = require("express").Router();
const { loginValidation, registerValidation, tokenValidation } = require("../utils/validation");
const { auth } = require("../controllers");

router.post("/login", loginValidation, auth.loginAccount);
router.post("/register", registerValidation, auth.registerAccount);
router.post("/exchangetoken", tokenValidation, auth.exchangeToken);

module.exports = router;
