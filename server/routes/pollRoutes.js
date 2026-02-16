const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");


// ================= CREATE POLL =================
router.post("/create", async (req, res) => {
  try {
    const { question, options, expiresInMinutes } = req.body;

    // validation
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: "Invalid poll data" });
    }

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    const newPoll = new Poll({
      question,
      options: options.map(opt => ({ text: opt })),
      expiresAt,
      voters: [] // ensure voters array exists
    });

    await newPoll.save();

    res.status(201).json({
      message: "Poll created successfully",
      pollId: newPoll._id
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// ================= VOTE ON POLL =================
router.post("/:id/vote", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // expiry check
    if (new Date() > poll.expiresAt) {
      return res.status(400).json({ message: "Poll has expired" });
    }

    const { optionIndex } = req.body;

    if (optionIndex === undefined || !poll.options[optionIndex]) {
      return res.status(400).json({ message: "Invalid option" });
    }

    // 🔥 REAL CLIENT IP FIX (important for Render/Vercel proxy)
    const voterIP =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;

    // prevent duplicate voting
    if (poll.voters.includes(voterIP)) {
      return res.status(403).json({ message: "You already voted" });
    }

    // add vote
    poll.options[optionIndex].votes += 1;
    poll.voters.push(voterIP);

    await poll.save();

    // emit live update via Socket.IO
    req.app.get("io").emit("voteUpdate", {
      pollId: poll._id.toString(),
      results: poll.options
    });

    res.json({
      message: "Vote recorded",
      results: poll.options
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// ================= GET POLL DETAILS =================
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json({
      question: poll.question,
      options: poll.options,
      expiresAt: poll.expiresAt
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
