const express = require("express");
const router = express.Router();
const { createBoard } = require("../controllers/boardcontroller");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createBoard);

module.exports = router;
