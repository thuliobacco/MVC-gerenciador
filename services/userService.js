const db = require('../config/db');

// Função para obter todos os usuários
const getAllUsers = async () => {
  try {
    const result = await db.query('SELECT * FROM Users ORDER BY id ASC');
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter usuários: ' + error.message);
  }
};

// Função para obter um usuário por ID
const getUserById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM Users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao obter usuário: ' + error.message);
  }
};

// Função para obter todas as tarefas de um usuário
const getTasksByUser = async (id) => {
  try {
    const query = `
      SELECT Tasks.id, Tasks.titulo, Tasks.descricao, Tasks.duracao, Tasks.created_at, Tasks.update_at
      FROM Tasks
      JOIN user_task ON Tasks.id = user_task.id_task
      WHERE user_task.id_user = $1
      ORDER BY Tasks.id ASC
    `;
    const result = await db.query(query, [id]);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter tarefas do usuário: ' + error.message);
  }
};

// Função para criar um novo usuário
const createUser = async (nome) => {
  try {
    const result = await db.query(
      'INSERT INTO Users (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao criar usuário: ' + error.message);
  }
};

// Função para atualizar um usuário por ID
const updateUser = async (id, nome) => {
  try {
    const result = await db.query(
      'UPDATE Users SET nome = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [nome, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao atualizar usuário: ' + error.message);
  }
};

// Função para deletar um usuário por ID
const deleteUser = async (id) => {
  try {
    const result = await db.query('DELETE FROM Users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao deletar usuário: ' + error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getTasksByUser,
  createUser,
  updateUser,
  deleteUser
};