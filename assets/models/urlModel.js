const mongoose = require("mongoose");

const Url = mongoose.model(
  "Url",
  new mongoose.Schema({
    original_url: {
      type: String,
      unique: true,
      required: true,
    },
    short_url: {
      type: Number,
      unique: true,
      required: true,
    },
    description: String,
  })
);

module.exports = Url;
