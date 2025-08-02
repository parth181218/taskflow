const express = require("express");
const router = express.Router();
const { createTask, updateTaskColumn, getTasksByBoard} = require("../controllers/taskcontroller");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, createTask);
router.put("/:taskId/move", authMiddleware, updateTaskColumn);
router.get("/board/:boardId", authMiddleware, getTasksByBoard);


module.exports = router;
