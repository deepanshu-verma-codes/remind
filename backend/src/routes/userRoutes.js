const express = require("express");
const router = express.Router();
const { updateProfile, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
