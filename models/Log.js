import mongoose from "mongoose";
const Schema = mongoose.Schema;

const logsSchema = new Schema(
  {
    description: {
      type: String,
    },
    type: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("logs", logsSchema);
