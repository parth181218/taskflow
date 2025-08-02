const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authroutes");
const boardRoutes = require("./routes/boardroutes");
const columnRoutes = require("./routes/columnroutes");
const taskRoutes = require("./routes/taskroutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => res.send("TaskFlow API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
