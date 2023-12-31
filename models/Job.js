const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    jobID: String,
    jobKey: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("jobs", jobSchema);
