// const winston = require("winston");
// require("winston-mongodb");

module.exports = function () {
  process
    // 捕获同步 异常进程
    .on("uncaughtException", err => {
      console.error("uncaughtException:", err);
      // 这里用了 winston 中的 exceptionHandlers  会默认结束进程 (exitOnError:true)。
      // process.exit(1);
    })
    // 捕获异步 异常进程
    .on("unhandledRejection", err => {
      console.error("unhandledRejection:", err);
      // 这里用了 winston 中的 rejectionHandlers  会默认结束进程。
    });

  // 日志信息绑定数据库
  // 有 bug https://github.com/winstonjs/winston-mongodb/issues/175
  // winston.add(
  //   new winston.transports.MongoDB({
  //     level: "error",
  //     db: dbUri,
  //     options: {
  //       useUnifiedTopology: true
  //     },
  //     collection: "log"
  //   })
  // );
};
