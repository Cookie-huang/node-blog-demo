const mongoose = require("mongoose");

// 连接数据库
mongoose.connect("mongodb://localhost/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: "/public/img/avatar-default.png"
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  status: {
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    type: Number,
    enum: [0, 1, 1],
    default: 0
  }
});

module.exports = mongoose.model("User", UserSchema);
