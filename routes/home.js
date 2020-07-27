const express = require("express");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index.html", {
    user: req.session.user
  });
});

router.get("/logout", function (req, res) {
  // 清除登录状态
  req.session.user = null;

  // 重定向到登录页
  res.redirect("/login");
});

module.exports = router;
