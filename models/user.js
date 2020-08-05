const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  // 数据架构
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: true,
    match: /.*@.*/ // ps:随便写的
    // lowercase:true,  // 小写
    // uppercase:true,  // 大写
    // trim:true  //去掉空格
    // set:val => val,  // 写入函数
    // get:val=>val // 读取函数
  },
  nickname: {
    type: String,
    minlength: 3,
    maxlength: 100,
    unique: true,
    required: function () {
      // 这里可以用 this 来额外操作   注意这里要用匿名函数
      return this.email;
      // return true;
    }
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
  age: {
    type: Number,
    min: 1,
    max: 90
  },
  status: {
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  tags: {
    type: Array,
    // 自定义验证器  对象，validator  message
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: "should have at least one tag."
    }
  },
  asyncTags: {
    type: Array,
    // 自定义异步验证器  对象  validator  message
    validate: {
      validator: function (value) {
        // 需求有可能要文件 数据库 或者远程服务的返回计算值
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const result = value && value.length > 0;
            resolve(result);

            // resolve(false); -> error
            // reject(new Error()); -> error
          }, 1000);
        });
      },
      message: "async ---- should have at least one tag."
    }
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      nickname: this.nickname,
      _id: this._id
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

// 导出集合
exports.User = mongoose.model("User", userSchema);

// 导出Joi校验
exports.validateRegister = function (user) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    nickname: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(3).max(255).required()
  });

  return schema.validate(user);
};

exports.validateLogin = function (user) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  });

  return schema.validate(user);
};
