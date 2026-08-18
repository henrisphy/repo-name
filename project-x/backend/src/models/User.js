import pool from "../db.js";

class User {
  static async findByUsername(username) {
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return res.rows[0];
  }

  static async getTeamStaff(leadUsername) {
    const lead = await this.findByUsername(leadUsername);
    if (!lead || !lead.team || lead.team.length === 0) return [];
    const placeholders = lead.team.map((_, i) => `$${i + 1}`).join(",");
    const res = await pool.query(
      `SELECT username, name, division, avatar FROM users WHERE username IN (${placeholders})`,
      lead.team
    );
    return res.rows;
  }
}

export default User;
