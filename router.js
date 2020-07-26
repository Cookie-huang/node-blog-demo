const express = require("express");
const md5 = require("blueimp-md5");
const User = require("./models/user");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index.html", {
    user: req.session.user
  });
});

router.get("/login", function (req, res) {
  res.render("login.html");
});

router.post("/login", function (req, res, next) {
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

router.get("/register", function (req, res, next) {
  res.render("register.html");
});

router.post("/register", function (req, res, next) {
  const body = req.body;
  User.findOne(
    {
      $or: [
        {
          email: body.email
        },
        {
          nickname: body.nickname
        }
      ]
    },
    function (err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.status(200).json({
          err_code: 1,
          message: "Email or nickname already exists."
        });
      }

      // 注册 加密
      body.password = md5(md5(body.password));
      new User(body).save(function (err, user) {
        if (err) {
          return next(err);
        }

        req.session.user = {
          nickname: user.nickname
        };
        res.status(200).json({
          err_code: 0,
          message: "ok"
        });
      });
    }
  );
});

router.get("/logout", function (req, res) {
  // 清除登录状态
  req.session.user = null;

  // 重定向到登录页
  res.redirect("/login");
});

module.exports = router;
