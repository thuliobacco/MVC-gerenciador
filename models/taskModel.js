const db = require("../config/db");

module.exports = {
  async create(data) {
    const query =
      "INSERT INTO Tasks (titulo, descricao) VALUES ($1, $2) RETURNING *";
    const values = [data.titulo, data.descricao || null];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query("SELECT * FROM Tasks ORDER BY id ASC");
    return result.rows;
  },

  async findById(id) {
    const query = "SELECT * FROM Tasks WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async findCategoriesByTask(id) {
    const query = `
      SELECT Categories.id, Categories.titulo
      FROM Categories
      JOIN task_category ON Categories.id = task_category.id_category
      WHERE task_category.id_task = $1
      ORDER BY Categories.id ASC
    `;
    const result = await db.query(query, [id]);
    return result.rows;
  },

  async update(id, data) {
    const query =
      "UPDATE Tasks SET titulo = $1, descricao = $2, update_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *";
    const values = [data.titulo, data.descricao || null, id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = "DELETE FROM Tasks WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
