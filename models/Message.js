const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    messageID: String,
    message: String,
    name: String,
    metadata: {
      default: {},
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("messages", messageSchema);
