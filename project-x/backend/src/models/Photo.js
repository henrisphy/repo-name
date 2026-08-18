import pool from "../db.js";

class Photo {
  static async findByTask(taskId) {
    const res = await pool.query(
      "SELECT * FROM photos WHERE task_id = $1 ORDER BY timestamp ASC",
      [taskId]
    );
    return res.rows;
  }

  static async create(taskId, url, caption, username, userName) {
    const res = await pool.query(
      "INSERT INTO photos (task_id, url, caption, username, user_name) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [taskId, url, caption, username, userName]
    );
    return res.rows[0];
  }
}

export default Photo;
