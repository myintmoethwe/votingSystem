const db = require("../config/db");

exports.getAll = async () => {
  const { rows } = await db.query("SELECT * FROM participants ORDER BY id ASC");
  return rows;
};

exports.create = async (name, photo, description) => {
  const query = `
    INSERT INTO participants (name, photo, description)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const { rows } = await db.query(query, [name, photo, description]);
  return rows[0];
};

exports.delete = async (id) => {
  await db.query("DELETE FROM participants WHERE id = $1", [id]);
};
