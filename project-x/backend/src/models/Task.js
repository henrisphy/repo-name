import pool from "../db.js";

class Task {
  static async findAll(filters = {}) {
    let query = "SELECT * FROM tasks WHERE 1=1";
    const values = [];
    let idx = 1;
    if (filters.division) {
      query += ` AND division = $${idx++}`;
      values.push(filters.division);
    }
    if (filters.assignedTo) {
      query += ` AND assigned_to = $${idx++}`;
      values.push(filters.assignedTo);
    }
    if (filters.status) {
      query += ` AND status = $${idx++}`;
      values.push(filters.status);
    }
    query += " ORDER BY due_date ASC";
    const res = await pool.query(query, values);
    return res.rows;
  }

  static async findById(id) {
    const res = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return res.rows[0];
  }

  static async create(data) {
    const {
      title,
      description,
      assignedTo,
      assignedBy,
      division,
      dueDate,
      priority,
    } = data;
    const res = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, assigned_by, division, due_date, priority)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        title,
        description,
        assignedTo,
        assignedBy,
        division,
        dueDate,
        priority || "medium",
      ]
    );
    return res.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(val);
      }
    }
    values.push(id);
    const query = `UPDATE tasks SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`;
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async delete(id) {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  }
}

export default Task;
