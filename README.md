# monostich (单行诗)

本项目原名 cmdcopy, 主要用途是记录和复制 CLI 命令，
后来想扩展用途，用来记录任意一句话（例如一条命令、一个网址、一句备忘等等），
因此改名为 monostich。

## 安装

- <https://docs.aws.amazon.com/corretto/index.html>
- <https://maven.apache.org/install.html>

在安装了 JDK 17+ 和 maven 的前提下

```shell
git clone https://github.com/ahui2016/monostich.git
cd monostich
mvn package
mkdir db
java -jar ./target/monostich-0.0.1.jar
```

另外，在安装了 JDK 17+ 的前提下，也可以不使用 maven, 而是直接下载 jar: [monostich/releases/](https://github.com/ahui2016/monostich/releases/)

```shell
mkdir db
java -jar ./monostich-0.0.1.jar
```

### 手动创建 db 文件夹

在启动本软件时，要求当前目录有一个 'db' 文件夹，如果看到像下面那样的错误，
表示未找到 'db' 文件夹，请手动创建该文件夹，或进入有该文件夹的目录后再执行
`java -jar ./monostich-0.0.1.jar` 启动程序。

```text
Exception in thread "main" java.lang.ExceptionInInitializerError
        at cc.ai42.monostich.App.main(App.java:19)
Caused by: org.jdbi.v3.core.ConnectionException: java.sql.SQLException: path to 'db/monostich.sqlite': '/path/to/monostich/db' does not exist
```

### 端口

默认端口是 '7070', 可输入数字参数更改端口：

```shell
java -jar ./monostich-0.0.1.jar 7171
```

## 主要功能

- 在首页点击 'New' 跳转到 '新增一条记录' 页面。
- 输入标题和内容，点击 'Submit' 按钮，搞定。
- 其中，标题是用来方便搜索的，内容则是任意一句话（例如一条命令、一个网址、一句备忘等等）
- 首页有一个搜索框和最近新增项目列表。

## 次要功能

- 另外还有一个 'Group' 功能，可以把多条记录组合成一个 group
- 这是次要功能，因此并没有做太多精心设计，将就着用，聊胜于无。

## 切换数据库

- 这是一个非常方便的功能，让你可以拥有多个互不干扰的数据库，并且可随时切换。
- 在 'Config' 页面的 'DatabasePath' 栏输入一个文件名，点击 'Submit' 按钮即可切换。
- 如果输入的文件名不存在，会自动创建一个新数据库。
- 注意：重启程序后会自动打开默认数据库。

## 相关文章

本软件后端采用 Javalin, 前端采用 mj.js, 相关介绍请看以下文章。

- [超简单易用的 Java Web 框架 - Javalin](https://geeknote.net/SuperMild/posts/1428)
- [Javalin网站框架介绍之二 - 数据库](https://geeknote.net/SuperMild/posts/1430)
- [受 Mithril.js 启发的零学习成本极易用框架 - mj.js](https://geeknote.net/SuperMild/posts/1450)
