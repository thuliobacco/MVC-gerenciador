const db = require("../config/db");

// Função para obter todas as tarefas
const getAllTasks = async () => {
  try {
    const result = await db.query("SELECT * FROM Tasks ORDER BY id ASC");
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter tarefas: " + error.message);
  }
};

// Função para obter uma tarefa por ID
const getTaskById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM Tasks WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao obter tarefa: " + error.message);
  }
};

// Função para obter todas as categorias de uma tarefa
const getCategoriesByTask = async (id) => {
  try {
    const query = `
      SELECT Categories.id, Categories.titulo
      FROM Categories
      JOIN task_category ON Categories.id = task_category.id_category
      WHERE task_category.id_task = $1
      ORDER BY Categories.id ASC
    `;
    const result = await db.query(query, [id]);
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter categorias da tarefa: " + error.message);
  }
};

// Função para criar uma nova tarefa
const createTask = async (titulo, descricao, duracao) => {
  try {
    const result = await db.query(
      "INSERT INTO Tasks (titulo, descricao, duracao) VALUES ($1, $2, $3) RETURNING *",
      [titulo, descricao || null, duracao || null]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao criar tarefa: " + error.message);
  }
};

// Função para atualizar uma tarefa por ID
const updateTask = async (id, titulo, descricao, duracao) => {
  try {
    const result = await db.query(
      "UPDATE Tasks SET titulo = $1, descricao = $2, duracao = $3, update_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [titulo, descricao || null, duracao || null, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao atualizar tarefa: " + error.message);
  }
};

// Função para deletar uma tarefa por ID
const deleteTask = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM Tasks WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao deletar tarefa: " + error.message);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  getCategoriesByTask,
  createTask,
  updateTask,
  deleteTask,
};
