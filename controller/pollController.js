const participantModel = require("../model/participantModel");
const pollModel = require("../model/pollModel");

exports.renderHome = async (req, res) => {
  try {
    const participants = await participantModel.getAll();
    const user = req.session ? req.session.user : null;
    const hasVoted = req.session ? !!req.session.hasVoted : false;

    res.render("index", {
      participants,
      user,
      hasVoted,
      error: null,
    });
  } catch (error) {
    res.status(500).send("Error loading home page: " + error.message);
  }
};

exports.vote = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (req.session.hasVoted) {
      const participants = await participantModel.getAll();
      return res.render("index", {
        participants,
        user: req.session.user || null,
        hasVoted: true,
        error: "You have already submitted your vote!",
      });
    }

    if (!participantId) {
      const participants = await participantModel.getAll();
      return res.render("index", {
        participants,
        user: req.session.user || null,
        hasVoted: false,
        error: "Please select a candidate before voting.",
      });
    }

    const userId = req.session.user ? req.session.user.id : null;
    await pollModel.castVote(userId, participantId);

    // Save vote state in user's browser session
    req.session.hasVoted = true;

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error submitting vote: " + error.message);
  }
};
