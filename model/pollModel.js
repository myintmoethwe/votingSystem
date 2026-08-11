const db = require("../config/db");

exports.castVote = async (userId, participantId) => {
  // If a user is logged in, record user vote in 'votes' table
  if (userId) {
    await db.query(
      "INSERT INTO votes (user_id, participant_id) VALUES ($1, $2)",
      [userId, participantId],
    );
  }

  // Increment participant vote count
  await db.query(
    "UPDATE participants SET vote_count = vote_count + 1 WHERE id = $1",
    [participantId],
  );
};

exports.hasVoted = async (userId) => {
  if (!userId) return false;
  const { rows } = await db.query("SELECT * FROM votes WHERE user_id = $1", [
    userId,
  ]);
  return rows.length > 0;
};
