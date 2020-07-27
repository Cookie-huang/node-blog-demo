const express = require("express");
const md5 = require("blueimp-md5");
const User = require("../models/user");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("login.html");
});

router.post("/", function (req, res, next) {
  const body = req.body;

  User.findOne(
    {
      email: body.email,
      password: md5(md5(body.password))
    },
    function (err, user) {
      if (err) {
        return next(err);
      }

      // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
      if (!user) {
        return res.status(200).json({
          err_code: 1,
          message: "Email or password is invalid"
        });
      }

      // 用户存在，登陆成功，通过 Session 记录登陆状态
      req.session.user = {
        nickname: user.nickname
      };
      res.status(200).json({
        err_code: 0,
        message: "ok"
      });
    }
  );
});

module.exports = router;
