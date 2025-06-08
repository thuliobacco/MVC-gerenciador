const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

// Configuração do EJS como view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true })); // Para parsing de formulários
app.use(express.json()); // Para parsing de JSON
app.use(express.static(path.join(__dirname, "public"))); // Para arquivos estáticos

// Rotas da API
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userTaskRoutes = require("./routes/userTaskRoutes");
const taskCategoryRoutes = require("./routes/taskCategoryRoutes");

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/categories", categoryRoutes);
app.use("/user-task", userTaskRoutes);
app.use("/task-category", taskCategoryRoutes);

// Rotas do frontend
const frontRoutes = require("./routes/frontRoutes");
app.use("/", frontRoutes);

module.exports = app;
