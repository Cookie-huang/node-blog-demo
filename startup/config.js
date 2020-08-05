const config = require("config");

module.exports = function () {
  // jwt秘钥放在环境变量 如果没设置好 进程退出。
  if (!config.get("jwtPrivateKey")) {
    // 被 uncaughtException 捕获，日志记录，进程退出(exitOnError: true)。
    // 如果(exitOnError: false) 这里就得手动退出 process.exit(1)
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
