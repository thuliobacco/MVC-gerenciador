const db = require("../config/db");

module.exports = {
  async create(data) {
    const query = "INSERT INTO Users (nome) VALUES ($1) RETURNING *";
    const values = [data.nome];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query("SELECT * FROM Users ORDER BY id ASC");
    return result.rows;
  },

  async findById(id) {
    const query = "SELECT * FROM Users WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async findTasksByUser(id) {
    const query = `
      SELECT Tasks.id, Tasks.titulo, Tasks.descricao, Tasks.created_at, Tasks.update_at
      FROM Tasks
      JOIN user_task ON Tasks.id = user_task.id_task
      WHERE user_task.id_user = $1
      ORDER BY Tasks.id ASC
    `;
    const result = await db.query(query, [id]);
    return result.rows;
  },

  async update(id, data) {
    const query =
      "UPDATE Users SET nome = $1, update_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *";
    const values = [data.nome, id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = "DELETE FROM Users WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
