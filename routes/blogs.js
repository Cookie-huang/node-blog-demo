const express = require("express");
const _ = require("lodash");
const Blog = require("../models/blog");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/add", auth, function (req, res, next) {
  // router.get("/add", function (req, res, next) {
  /* session */
  // if (req.session.user) {
  //   res.render("add.html");
  // } else {
  //   res.render("login.html");
  // }

  /* token */
  res.render("add.html");
});

router.post("/add", auth, async (req, res, next) => {
  try {
    const params = _.pick(req.body, ["title", "content"]);
    params.author = req.user._id;
    await new Blog(params).save();
    res.status(200).json({
      err_code: 0,
      message: "ok"
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      await Blog.deleteOne({ _id: id });
      return res.status(200).json({
        err_code: 0,
        message: "ok"
      });
    }
  } catch (error) {
    return next(error);
  }
});

router.get("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (blog) {
      res.render("edit.html", {
        blog
      });
    } else {
      res.render("404.html");
    }
  } catch (error) {
    return res.render("404.html");
  }
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    await Blog.findByIdAndUpdate(
      id,
      {
        $set: { title, content }
      },
      { new: true }
    );

    return res.status(200).json({
      err_code: 0,
      message: "ok"
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
