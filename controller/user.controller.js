const { getAllParticipants, postVote } = require("../services/user.services")

exports.renderHome = async (req, res) => {
  const participants = await getAllParticipants()
  let winners = null

  winners = await getWinners()
  const user = req.session ? req.session.user : null
  const hasVoted = req.session ? !!req.session.hasVoted : false
  res.render("index", {
    participants,
    winners,
    user,
    hasVoted,
  })
}
exports.vote = async (req, res) => {
  try {
    const { kingId, queenId, mrSmartId, msStyleId, mrPopularId, msPopularId } =
      req.body

    if (req.session.hasVoted) {
      return res.redirect("/")
    }

    await postVote({
      kingId,
      queenId,
      mrSmartId,
      msStyleId,
      mrPopularId,
      msPopularId,
    })

    req.session.hasVoted = true
    res.redirect("/")
  } catch (error) {
    res.status(500).send("Error submitting votes: " + error.message)
  }
}
