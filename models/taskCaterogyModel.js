const db = require("../config/db");

module.exports = {
  async create(data) {
    const query =
      "INSERT INTO task_category (id_task, id_category) VALUES ($1, $2) RETURNING *";
    const values = [data.id_task, data.id_category];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByTaskAndCategory(id_task, id_category) {
    const query =
      "SELECT * FROM task_category WHERE id_task = $1 AND id_category = $2";
    const result = await db.query(query, [id_task, id_category]);
    return result.rows[0];
  },

  async delete(id_task, id_category) {
    const query =
      "DELETE FROM task_category WHERE id_task = $1 AND id_category = $2 RETURNING *";
    const result = await db.query(query, [id_task, id_category]);
    return result.rows[0];
  },
};
