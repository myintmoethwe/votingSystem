// services/admin.services.js
const db = require("../config/db");

exports.getKing = async () => {
  const { rows } = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"kingVotes\" DESC LIMIT 1"
  );
  return rows[0] || null;
};

exports.getQueen = async () => {
  const { rows } = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"queenVotes\" DESC LIMIT 1"
  );
  return rows[0] || null;
};

exports.getWinners = async () => {
  const king = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"kingVotes\" DESC LIMIT 1"
  );
  const queen = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"queenVotes\" DESC LIMIT 1"
  );
  const mrSmart = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"smartVotes\" DESC LIMIT 1"
  );
  const msStyle = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"styleVotes\" DESC LIMIT 1"
  );
  const mrPopular = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'boy' ORDER BY \"boyPopularVotes\" DESC LIMIT 1"
  );
  const msPopular = await db.query(
    "SELECT * FROM participants WHERE LOWER(gender) = 'girl' ORDER BY \"girlPopularVotes\" DESC LIMIT 1"
  );

  return {
    king: king.rows[0] || null,
    queen: queen.rows[0] || null,
    mrSmart: mrSmart.rows[0] || null,
    msStyle: msStyle.rows[0] || null,
    mrPopular: mrPopular.rows[0] || null,
    msPopular: msPopular.rows[0] || null,
  };
};

exports.createParticipant = async (name, photo, description, gender, hobby, hometown) => {
  const query = `
    INSERT INTO participants (name, photo, description, gender, hobby, hometown)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const { rows } = await db.query(query, [
    name,
    photo || null,
    description || null,
    gender || "boy",
    hobby || null,
    hometown || null,
  ]);
  return rows[0];
};

exports.deleteParticipant = async (id) => {
  await db.query("DELETE FROM participants WHERE id = $1", [id]);
};

exports.updateParticipant = async (id, name, photo, description, gender, hobby, hometown) => {
  if (photo) {
    const query = `
      UPDATE participants 
      SET name = $1, photo = $2, description = $3, gender = $4, hobby = $5, hometown = $6 
      WHERE id = $7 
      RETURNING *;
    `;
    const { rows } = await db.query(query, [name, photo, description || null, gender || "boy", hobby || null, hometown || null, id]);
    return rows[0];
  } else {
    const query = `
      UPDATE participants 
      SET name = $1, description = $2, gender = $3, hobby = $4, hometown = $5 
      WHERE id = $6 
      RETURNING *;
    `;
    const { rows } = await db.query(query, [name, description || null, gender || "boy", hobby || null, hometown || null, id]);
    return rows[0];
  }
};

exports.getTotalVotes = async () => {
  const query = `
    SELECT 
      COALESCE(SUM("kingVotes"), 0) AS total_king_votes,
      COALESCE(SUM("queenVotes"), 0) AS total_queen_votes,
      COALESCE(SUM("smartVotes"), 0) AS total_smart_votes,
      COALESCE(SUM("styleVotes"), 0) AS total_style_votes,
      COALESCE(SUM("boyPopularVotes"), 0) AS total_boy_popular_votes,
      COALESCE(SUM("girlPopularVotes"), 0) AS total_girl_popular_votes
    FROM participants;
  `;
  const { rows } = await db.query(query);
  return rows[0];
};

exports.getSettings = async () => {
  const { rows } = await db.query("SELECT * FROM settings WHERE id = 1");
  return rows[0];
};

exports.updateSettings = async (data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`"${key}" = $${index++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return;

  values.push(1); // For WHERE id = 1
  const query = `UPDATE settings SET ${fields.join(", ")} WHERE id = $${index}`;
  await db.query(query, values);
};

exports.updateCountdownService = async ({ target_time, duration, countdown_status }) => {
    let validTargetTime;
    if (!target_time || isNaN(Number(target_time))) {
        validTargetTime = new Date();
    } else {
        validTargetTime = new Date(Number(target_time));
    }

    // Voting is open only if status is 'running'
    const isOpen = countdown_status === 'running';

    const query = `
        UPDATE settings 
        SET target_time = $1, duration = $2, countdown_status = $3, is_voting_open = $4 
        WHERE id = 1
    `;
    return await db.query(query, [validTargetTime, duration, countdown_status, isOpen]);
};

exports.updateCountdownStatusService = async (status) => {
    // Voting is open only if status is 'running'
    const isOpen = status === 'running';

    if (status === 'Reset') {
        return await db.query(
            `UPDATE settings SET countdown_status = $1, target_time = NULL, duration = NULL, is_voting_open = $2 WHERE id = 1`,
            [status, isOpen]
        );
    }
    return await db.query(
        `UPDATE settings SET countdown_status = $1, is_voting_open = $2 WHERE id = 1`,
        [status, isOpen]
    );
};