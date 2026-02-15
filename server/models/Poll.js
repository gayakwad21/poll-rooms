const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  expiresAt: { type: Date, required: true },
  voters: { type: [String], default: [] } // store IP/token for fairness
}, { timestamps: true });

module.exports = mongoose.model("Poll", pollSchema);
