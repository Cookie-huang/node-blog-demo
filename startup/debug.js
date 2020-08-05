const starupDebugger = require("debug")("startup");
const dbDebugger = require("debug")("db");

module.exports = function () {
  // 当环境变量 DEBUG 是 startup 的时候，这个调试信息会被打印。
  // window 修改环境变量:    set DEBUG=startup
  starupDebugger("app startup........");
  dbDebugger("db startup........");
};
