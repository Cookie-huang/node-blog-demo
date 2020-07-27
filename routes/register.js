const express = require("express");
const md5 = require("blueimp-md5");
const User = require("../models/user");

const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("register.html");
});

router.post("/", function (req, res, next) {
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

module.exports = router;
