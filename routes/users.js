const express = require("express");
const md5 = require("blueimp-md5");
const _ = require("lodash");
const auth = require("../middleware/auth"); // 验证
const asyncMiddleWare = require("../middleware/async"); // 包裹 统一处理 try-catch

const { User, validateRegister, validateLogin } = require("../models/user");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/login", function (req, res) {
  res.render("login.html");
});

router.post(
  "/login",
  asyncMiddleWare(async (req, res) => {
    const params = _.pick(req.body, ["email", "password"]);

    const { error } = validateLogin(params);
    if (error)
      return res.status(400).json({
        err_code: 400,
        message: error.details[0].message
      });

    const user = await User.findOne({
      email: params.email,
      password: md5(md5(params.password))
    });

    // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
    if (!user) {
      return res.status(400).json({
        err_code: 1,
        message: "Email or password is invalid"
      });
    }

    // 用户存在，登陆成功，通过 Session 记录登陆状态
    // req.session.user = {
    //   nickname: user.nickname,
    //   id: user._id
    // };

    const token = user.generateAuthToken();

    res
      .cookie("token", token, {
        // domain:"localhost",
        // path: '/user'
      })
      .json({
        err_code: 0,
        message: "ok",
        token
      });
  })
);

router.get("/register", function (req, res, next) {
  res.render("register.html");
});

router.post("/register", async (req, res) => {
  const params = _.pick(req.body, ["email", "nickname", "password"]);

  // 校验数据 （虽然mongoose也会校验
  const { error } = validateRegister(params);
  if (error)
    return res.status(400).json({
      err_code: 400, // bad request
      message: error.details[0].message
    });

  let user = await User.findOne({
    $or: [
      {
        email: params.email
      },
      {
        nickname: params.nickname
      }
    ]
  });

  if (user) {
    return res.status(200).json({
      err_code: 1,
      message: "Email or nickname already exists."
    });
  }

  // 测试自定义验证器
  params.tags = ["tag A"];
  params.asyncTags = ["asyncTag A"];
  params.password = md5(md5(params.password)); // 注册 加密

  user = new User(params);
  await user.save();

  // req.session.user = { nickname: user.nickname, id: user._id };

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).status(200).json({
    err_code: 0,
    message: "ok"
  });
});

module.exports = router;
