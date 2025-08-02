const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/usercontroller");
const authMiddleware = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser); // ✅ add this line
router.get("/profile", authMiddleware, (req, res) => {
  // This route can be used to get user profile after login
  res.status(200).json({ message: "User profile accessed", user: req.user });
});

module.exports = router;
