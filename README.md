# node-blog-demo

黑马课程 node 案例 MOSH 课程案例

1. 先启动数据库 对应盘符 cmd ： mongod
2. 启动项目 set blog_jwtPrivateKey=xxx & nodemon app

可以登录注册，博客：CRUD

注意： - 非前后端分离，接口又 restful 风格，所以会很怪。 - 工作中前后端分离 请求带上 token，请求头"x-auth-token"
