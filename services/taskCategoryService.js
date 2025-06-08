const db = require("../config/db");

// Função para criar uma nova associação tarefa-categoria
const createTaskCategory = async (id_task, id_category) => {
  try {
    const result = await db.query(
      "INSERT INTO task_category (id_task, id_category) VALUES ($1, $2) RETURNING *",
      [id_task, id_category]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(
      "Erro ao criar associação tarefa-categoria: " + error.message
    );
  }
};

// Função para deletar uma associação tarefa-categoria
const deleteTaskCategory = async (id_task, id_category) => {
  try {
    const result = await db.query(
      "DELETE FROM task_category WHERE id_task = $1 AND id_category = $2 RETURNING *",
      [id_task, id_category]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(
      "Erro ao deletar associação tarefa-categoria: " + error.message
    );
  }
};

module.exports = {
  createTaskCategory,
  deleteTaskCategory,
};
