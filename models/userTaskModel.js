const db = require("../config/db");

module.exports = {
  async create(data) {
    const query =
      "INSERT INTO user_task (id_user, id_task) VALUES ($1, $2) RETURNING *";
    const values = [data.id_user, data.id_task];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByUserAndTask(id_user, id_task) {
    const query = "SELECT * FROM user_task WHERE id_user = $1 AND id_task = $2";
    const result = await db.query(query, [id_user, id_task]);
    return result.rows[0];
  },

  async delete(id_user, id_task) {
    const query =
      "DELETE FROM user_task WHERE id_user = $1 AND id_task = $2 RETURNING *";
    const result = await db.query(query, [id_user, id_task]);
    return result.rows[0];
  },
};
