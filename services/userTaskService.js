const db = require("../config/db");

// Função para criar uma nova associação usuário-tarefa
const createUserTask = async (id_user, id_task) => {
  try {
    const result = await db.query(
      "INSERT INTO user_task (id_user, id_task) VALUES ($1, $2) RETURNING *",
      [id_user, id_task]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(
      "Erro ao criar associação usuário-tarefa: " + error.message
    );
  }
};

// Função para deletar uma associação usuário-tarefa
const deleteUserTask = async (id_user, id_task) => {
  try {
    const result = await db.query(
      "DELETE FROM user_task WHERE id_user = $1 AND id_task = $2 RETURNING *",
      [id_user, id_task]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(
      "Erro ao deletar associação usuário-tarefa: " + error.message
    );
  }
};

module.exports = {
  createUserTask,
  deleteUserTask,
};
