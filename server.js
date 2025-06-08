require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/db");

const app = express();

// Configuração do EJS como view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json()); // Para parsing de JSON (APIs REST)
app.use(bodyParser.urlencoded({ extended: true })); // Para parsing de formulários
app.use(express.static(path.join(__dirname, "public"))); // Para arquivos estáticos (CSS, JS, etc.)

// Rotas da API
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userTaskRoutes = require("./routes/userTaskRoutes");
const taskCategoryRoutes = require("./routes/taskCategoryRoutes");

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/user-task", userTaskRoutes);
app.use("/api/task-category", taskCategoryRoutes);

// Rotas do frontend (para renderizar views EJS)
const frontRoutes = require("./routes/frontRoutes");
app.use("/", frontRoutes);

// Middleware para lidar com erros de rota não encontrada
app.use((req, res, next) => {
  res.status(404).send("Página não encontrada");
});

// Middleware para lidar com erros internos do servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erro no servidor");
});

// Conexão com o banco de dados e inicialização do servidor
db.connect()
  .then(() => {
    console.log("Conectado ao banco de dados PostgreSQL");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });


