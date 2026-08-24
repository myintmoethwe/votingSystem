const db = require("../config/db")

exports.createAdmin = async (name, email, password) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) RETURNING id, name, email;
  `
  const { rows } = await db.query(query, [name, email, password])
  return rows[0]
}
