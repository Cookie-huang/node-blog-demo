const jwt = require("jsonwebtoken");
const config = require("config");

function logined(req, res, next) {
  const { token } = req.cookies;

  if (token) {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
  }
  next();
}

module.exports = logined;
