const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const starupDebugger = require("debug")("startup");
const dbDebugger = require("debug")("db");
const path = require("path");
// const bodyParser = require("body-parser");
const session = require("express-session");
const logger = require("./middleware/logger");
const home = require("./routes/home");
const login = require("./routes/login");
const register = require("./routes/register");

const app = express();

// 当环境变量 DEBUG 是 startup 的时候，这个调试信息会被打印。
// window 修改环境变量:    set DEBUG=startup
starupDebugger("app startup........");
dbDebugger("db startup........");

/*
{ 
  dbConfig: { host: 'dev-db-server', port: 5984, dbName: 'customers' },
  credit: { initialLimit: 100, initialDays: 30 } 
}
获取配置信息
console.log(config.get("Customer"));
*/

// 加强 HTTP 请求头部安全
app.use(helmet());

// 根据环境使用中间件
// 日志记录中间件
// process.env.NODE_ENV   没配置的话，默认是 undefined
// app.get("env")         没配置的话，默认是 "development"
if (app.get("env") === "development") {
  // GET / 200 2201 - 67.156 ms
  // GET /public/img/logo3.png 200 7219 - 4.704 ms
  // GET /node_modules/bootstrap/dist/css/bootstrap.css 200 198313 - 18.317 ms
  // GET /node_modules/jquery/dist/jquery.js 200 287630 - 12.096 ms
  // GET /node_modules/bootstrap/dist/js/bootstrap.js 200 136323 - 27.709 ms
  // GET /public/img/avatar-default.png 200 1325 - 41.720 ms
  // GET /favicon.ico 200 147 - 3.034 ms
  /* app.use(morgan("tiny")); */
  /* console.log("Morgan enabled..."); */
}

// 开放静态资源
app.use("/public/", express.static(path.join(__dirname, "./public/")));
app.use(
  "/node_modules/",
  express.static(path.join(__dirname, "./node_modules/"))
);

// 注册模板 view engine setup
app.engine("html", require("express-art-template"));
app.set("views", path.join(__dirname, "./views/"));

// 配置解析表单post
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
// app.use(bodyParser.json());

// express内建中间件   （和 bodyParser 效果一样）
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 配置session
app.use(
  session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: "cooky",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
    cookie: { secure: false }
  })
);

// 自定义中间件
app.use(logger);

// 配置路由
app.use("/", home);
app.use("/login", login);
app.use("/register", register);

// 配置一个处理 404 的中间件
app.use(function (req, res) {
  res.render("404.html");
});

// 配置一个全局错误处理中间件
app.use(function (err, req, res, next) {
  res.status(500).json({
    err_code: 500,
    message: err.message
  });
});

// 环境端口
const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
