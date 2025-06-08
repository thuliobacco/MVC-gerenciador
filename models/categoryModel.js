const db = require("../config/db");

module.exports = {
  async create(data) {
    const query = "INSERT INTO Categories (titulo) VALUES ($1) RETURNING *";
    const values = [data.titulo];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query("SELECT * FROM Categories ORDER BY id ASC");
    return result.rows;
  },

  async findById(id) {
    const query = "SELECT * FROM Categories WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const query = "UPDATE Categories SET titulo = $1 WHERE id = $2 RETURNING *";
    const values = [data.titulo, id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = "DELETE FROM Categories WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
