const pool = require('../config/db');
const {
  createParticipant,
  getTotalVotes,
  updateParticipant,
  deleteParticipant,
  updateSettings,
  getSettings,
  getWinners,
  updateCountdownService,
  updateCountdownStatusService,
} = require("../services/admin.services");
const { getAllParticipants } = require("../services/user.services");

exports.createParticipant = async (req, res) => {
  const { name, description, gender, hobby, hometown } = req.body;
  const photo = req.file
    ? `/uploads/${req.file.filename}`
    : "/uploads/default.jpg";
  await createParticipant(name, photo, description, gender, hobby, hometown);
  res.redirect("/admin/dashboard?section=candidates");
};

exports.updateParticipant = async (req, res) => {
  const id = req.params.id;
  const { name, description, gender, hobby, hometown } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  await updateParticipant(id, name, photo, description, gender, hobby, hometown);
  res.redirect("/admin/dashboard?section=candidates"); 
};

exports.deleteParticipant = async (req, res) => {
  await deleteParticipant(req.params.id);
  res.redirect("/admin/dashboard?section=candidates");
};

exports.renderSettings = async (req, res) => {
  try {
    const winners = await getWinners();
    const participants = await getAllParticipants();
    const stats = await getTotalVotes();
    const settings = await getSettings();

    res.render("admin-dashboard", {
      winners,
      stats,
      participants,
      settings,
      user: req.session.user,
      vote_count: stats,
    });
  } catch (err) {
    console.error("Error rendering settings:", err);
    res.status(500).send("Server Error");
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { event_date, is_voting_open, one_vote_per_student, show_results } = req.body;
    
    const settingsData = {
      event_date: event_date || null,
      is_voting_open: is_voting_open === "open" || is_voting_open === true || is_voting_open === "on",
      one_vote_per_student: one_vote_per_student === "on" || one_vote_per_student === true,
      show_results: show_results === "on" || show_results === true,
    };

    await updateSettings(settingsData);
    res.redirect("/admin/dashboard?section=settings");
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).send("Server Error");
  }
};

exports.updateCountdown = async (req, res) => {
    try {
        const { target_time, remaining, duration, countdown_status } = req.body;

        await updateCountdownService({ target_time, remaining, duration, countdown_status });

        const io = req.app.get('io');
        if (io) {
            io.emit('countdownUpdated', {
                target_time,
                remaining,
                duration,
                countdown_status
            });
        }

        res.json({ success: true, message: "Countdown updated successfully" });
    } catch (err) {
        console.error("Error updating countdown:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.pauseCountdown = async (req, res) => {
    try {
        await updateCountdownStatusService('Paused');
        
        const settings = await getSettings();
        const io = req.app.get('io');
        if (io) {
            io.emit('countdownUpdated', {
                target_time: settings.target_time,
                remaining: settings.remaining,
                duration: settings.duration,
                countdown_status: 'Paused'
            });
        }

        res.json({ success: true, message: "Countdown paused" });
    } catch (err) {
        console.error("Error pausing countdown:", err);
        res.status(500).json({ error: "Failed to pause" });
    }
};

exports.resumeCountdown = async (req, res) => {
    try {
        await updateCountdownStatusService('running');

        const settings = await getSettings();
        const io = req.app.get('io');
        if (io) {
            io.emit('countdownUpdated', {
                target_time: settings.target_time,
                remaining: settings.remaining,
                duration: settings.duration,
                countdown_status: 'running'
            });
        }

        res.json({ success: true, message: "Countdown resumed" });
    } catch (err) {
        console.error("Error resuming countdown:", err);
        res.status(500).json({ error: "Failed to resume" });
    }
};

exports.resetCountdown = async (req, res) => {
    try {
        await updateCountdownStatusService('Reset');

        const settings = await getSettings();
        const io = req.app.get('io');
        if (io) {
            io.emit('countdownUpdated', {
                target_time: settings.target_time,
                remaining: settings.remaining,
                duration: settings.duration,
                countdown_status: 'Reset'
            });
        }

        res.json({ success: true, message: "Countdown reset" });
    } catch (err) {
        console.error("Error resetting countdown:", err);
        res.status(500).json({ error: "Failed to reset" });
    }
};

exports.renderAdminDashboard = async (req, res) => {
  try {
    const winners = await getWinners();
    const participants = await getAllParticipants();
    const stats = await getTotalVotes();
    const settings = await getSettings(); 

    res.render("admin-dashboard", {
      winners,
      stats,
      participants,
      settings, 
      user: req.session.user,
      vote_count: stats,
    });
  } catch (err) {
    console.error("Error loading admin dashboard:", err);
    res.status(500).send("Server Error");
  }
};

exports.renderResultsPage = async (req, res) => {
  try {
    const winners = await getWinners();
    const settings = await getSettings(); // Fetch settings here
    
    const votesQuery = await pool.query(`
      SELECT COALESCE(SUM("kingVotes" + "queenVotes" + "smartVotes" + "styleVotes" + "boyPopularVotes" + "girlPopularVotes"), 0) AS total_votes 
      FROM participants
    `);

    const studentsQuery = await pool.query(`
      SELECT COUNT(*) AS total_students FROM voted_users
    `);

    const totalVotes = votesQuery.rows[0].total_votes;
    const totalStudentsVoted = studentsQuery.rows[0].total_students;

    res.render("results", {
      winners,
      totalVotes,
      totalStudentsVoted,
      settings 
    });
  } catch (error) {
    console.error("Error loading results page:", error);
    res.status(500).send("Server Error: " + error.message);
  }
};

exports.getCountdownStatusApi = async (req, res) => {
    try {
        const settings = await getSettings();
        res.json({
            target_time: settings.target_time,
            duration: settings.duration,
            countdown_status: settings.countdown_status
        });
    } catch (err) {
        console.error("Error fetching countdown status API:", err);
        res.status(500).json({ error: "Server Error" });
    }
}; 