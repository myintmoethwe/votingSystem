const db = require("../config/db")

exports.postVote = async ({
  kingId,
  queenId,
  mrSmartId,
  msStyleId,
  mrPopularId,
  msPopularId,
}) => {
  if (kingId)
    await db.query(
      'UPDATE participants SET "kingVotes" = "kingVotes" + 1 WHERE id = $1',
      [kingId],
    )
  if (queenId)
    await db.query(
      'UPDATE participants SET "queenVotes" = "queenVotes" + 1 WHERE id = $1',
      [queenId],
    )
  if (mrSmartId)
    await db.query(
      'UPDATE participants SET "smartVotes" = "smartVotes" + 1 WHERE id = $1',
      [mrSmartId],
    )
  if (msStyleId)
    await db.query(
      'UPDATE participants SET "styleVotes" = "styleVotes" + 1 WHERE id = $1',
      [msStyleId],
    )
  if (mrPopularId)
    await db.query(
      'UPDATE participants SET "popularVotes" = "popularVotes" + 1 WHERE id = $1',
      [mrPopularId],
    )
  if (msPopularId)
    await db.query(
      'UPDATE participants SET "popularVotes" = "popularVotes" + 1 WHERE id = $1',
      [msPopularId],
    )
}

exports.getVoteStatus = async (userId) => {
  if (!userId) return false
  const { rows } = await db.query("SELECT * FROM votes WHERE user_id = $1", [
    userId,
  ])
  return rows.length > 0
}

exports.getAllParticipants = async () => {
  const query = `
SELECT 
      ROW_NUMBER() OVER (ORDER BY id ASC) AS display_id,
      id,
      name,
      photo,
      description,
      gender
    FROM participants;  `
  const { rows } = await db.query(query)
  return rows
}
