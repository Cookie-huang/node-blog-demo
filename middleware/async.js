// 优化每个路由都要写的 try-catch 块的问题
// 也可以使用npm包： express-async-errors
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      return next(err);
    }
  };
};
