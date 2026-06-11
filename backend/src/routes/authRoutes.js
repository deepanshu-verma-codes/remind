const express = require("express");
const router = express.Router();
const { register, login, checkUsername } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/check-username/:username", checkUsername);

module.exports = router;
