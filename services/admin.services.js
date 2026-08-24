const db = require("../config/config")

exports.getKing = async () => {
  const { rows } = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"kingVotes\" DESC LIMIT 1",
  )
  return rows[0] || null
}

exports.getQueen = async () => {
  const { rows } = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"queenVotes\" DESC LIMIT 1",
  )
  return rows[0] || null
}
exports.getWinners = async () => {
  const king = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"kingVotes\" DESC LIMIT 1",
  )
  const queen = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"queenVotes\" DESC LIMIT 1",
  )
  const mrSmart = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"smartVotes\" DESC LIMIT 1",
  )
  const msStyle = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"styleVotes\" DESC LIMIT 1",
  )
  const mrPopular = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"popularVotes\" DESC LIMIT 1",
  )
  const msPopular = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"popularVotes\" DESC LIMIT 1",
  )

  return {
    king: king.rows[0] || null,
    queen: queen.rows[0] || null,
    mrSmart: mrSmart.rows[0] || null,
    msStyle: msStyle.rows[0] || null,
    mrPopular: mrPopular.rows[0] || null,
    msPopular: msPopular.rows[0] || null,
  }
}

exports.createParticipant = async (name, photo, description, gender) => {
  const query = `
    INSERT INTO participants (name, photo, description, gender)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `
  const { rows } = await db.query(query, [
    name,
    photo,
    description,
    gender || "boy",
  ])
  return rows[0]
}

exports.deleteParticipant = async (id) => {
  await db.query("DELETE FROM participants WHERE id = $1", [id])
}

exports.updateParticipantImage = async (id, name, photo, description) => {
  if (photo) {
    const query = `
      UPDATE participants 
      SET name = $1, photo = $2, description = $3 
      WHERE id = $4 
      RETURNING *;
    `
    const { rows } = await db.query(query, [name, photo, description, id])
    return rows[0]
  } else {
    const query = `
      UPDATE participants 
      SET name = $1, description = $2 
      WHERE id = $3 
      RETURNING *;
    `
    const { rows } = await db.query(query, [name, description, id])
    return rows[0]
  }
}

exports.getTotalVotes = async () => {
  const query = `
    SELECT 
      COALESCE(SUM("kingVotes"), 0) AS total_king_votes,
      COALESCE(SUM("queenVotes"), 0) AS total_queen_votes,
      COALESCE(SUM("smartVotes"), 0) AS total_smart_votes,
      COALESCE(SUM("styleVotes"), 0) AS total_style_votes,
      COALESCE(SUM("popularVotes"), 0) AS total_popular_votes
    FROM participants;
  `
  const { rows } = await db.query(query)
  return rows[0]
}

exports.getSettings = async () => {
  const { rows } = await db.query("SELECT * FROM settings WHERE id = 1")
  return rows[0]
}

exports.updateSettings = async ({
  election_name,
  start_date,
  end_date,
  is_voting_open,
  one_vote_per_student,
  show_results,
}) => {
  const query = `
    UPDATE settings 
    SET election_name = $1, start_date = $2, end_date = $3, is_voting_open = $4, one_vote_per_student = $5, show_results = $6
    WHERE id = 1
  `
  await db.query(query, [
    election_name,
    start_date || null,
    end_date || null,
    is_voting_open === "open" || is_voting_open === true,
    one_vote_per_student === "on" || one_vote_per_student === true,
    show_results === "on" || show_results === true,
  ])
}
