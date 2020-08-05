const express = require("express");
const logined = require("../middleware/logined");

const router = express.Router();
const Blog = require("../models/blog");

router.get("/", logined, async (req, res) => {
  const blogs = await Blog.find()
    .populate("author", "nickname -_id")
    .sort("-created_time")
    .limit(10);

  res.render("index.html", {
    user: req.user,
    blogs
  });
});

module.exports = router;
