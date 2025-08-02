const express = require("express");
const router = express.Router();
const { createColumn } = require("../controllers/columncontroller");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createColumn);

module.exports = router;
