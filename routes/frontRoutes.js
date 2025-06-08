const express = require("express");
const router = express.Router();
const path = require("path");
const userService = require("../services/userService");
const taskService = require("../services/taskService");

router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const tasks = await taskService.getAllTasks();
    res.render(path.join(__dirname, "../views/layout/main"), {
      pageTitle: "Gerenciador de Tarefas",
      content: path.join(__dirname, "../views/pages/page1"),
      users,
      tasks,
    });
  } catch (error) {
    console.error("Erro ao carregar a página inicial:", error);
    res.status(500).send("Erro ao carregar a página inicial");
  }
});

router.get("/about", (req, res) => {
  res.render(path.join(__dirname, "../views/layout/main"), {
    pageTitle: "Sobre o Gerenciador de Tarefas",
    content: path.join(__dirname, "../views/pages/page2"),
  });
});

module.exports = router;
