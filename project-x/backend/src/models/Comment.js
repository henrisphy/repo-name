import pool from "../db.js";

class Comment {
  static async findByTask(taskId) {
    const res = await pool.query(
      "SELECT * FROM comments WHERE task_id = $1 ORDER BY timestamp ASC",
      [taskId]
    );
    return res.rows;
  }

  static async create(taskId, username, userName, text) {
    const res = await pool.query(
      "INSERT INTO comments (task_id, username, user_name, text) VALUES ($1,$2,$3,$4) RETURNING *",
      [taskId, username, userName, text]
    );
    return res.rows[0];
  }
}

export default Comment;
