const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = Schema({
  author: {
    // 引用型
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  content: {
    type: String,
    required: true,
    minlength: 0
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Blog", blogSchema);
