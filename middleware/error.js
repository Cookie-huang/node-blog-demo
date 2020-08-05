const logger = require("./logger");

// 仅处理 Express 框架中的请求部分
// 错误处理中间件，独立封装细节
// 不同于其他中间件，错误中间件有 4 个参数
module.exports = function (err, req, res, next) {
  logger.log({
    level: "error",
    err: err.message,
    stack: err.stack
  });

  res.status(500).json({
    err_code: 500,
    message: err.message
  });
};
