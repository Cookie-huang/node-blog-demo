const express = require("express");
const config = require("config");
const logger = require("./middleware/logger");

const app = express();

require("./startup/logging")(); // 异常 ；日志
require("./startup/config")(); // 配置
require("./startup/db")(); // 数据库
require("./startup/routes")(app); // 中间件 路由
require("./startup/debug")(); // 调试

// 环境端口
const port = process.env.PORT || config.get("serverConfig.port");
app.listen(port, () => logger.info(`Listening on port ${port}...`));
