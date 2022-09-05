# Monostich (单行诗)

本项目原名 cmdcopy, 主要用途是记录和复制 CLI 命令，
后来想扩展用途，用来记录任意一句话（例如一条命令、一个网址、一句备忘等等），
因此改名为 Monostich。

## 安装

- <https://docs.aws.amazon.com/corretto/index.html>
- <https://maven.apache.org/install.html>

在安装了 JDK 17+ 和 maven 的前提下

```shell
git clone https://github.com/ahui2016/monostich.git
cd monostich
mvn package
mkdir db
java -jar ./target/monostich-0.0.5.jar
```

另外，在安装了 JDK 17+ 的前提下，也可以不使用 maven, 而是直接下载 jar: [monostich/releases/](https://github.com/ahui2016/monostich/releases/)

```shell
mkdir db
java -jar ./monostich-0.0.5.jar
```

### 手动创建 db 文件夹

在启动本软件时，要求当前目录有一个 'db' 文件夹，如果看到像下面那样的错误，
表示未找到 'db' 文件夹，请手动创建该文件夹，或进入有该文件夹的目录后再执行
`java -jar ./monostich-0.0.5.jar` 启动程序。

```text
Exception in thread "main" java.lang.ExceptionInInitializerError
        at cc.ai42.monostich.App.main(App.java:19)
Caused by: org.jdbi.v3.core.ConnectionException: java.sql.SQLException: path to 'db/monostich.sqlite': '/path/to/monostich/db' does not exist
```

### 端口

默认端口是 '7070', 可输入数字参数更改端口：

```shell
java -jar ./monostich-0.0.5.jar 7171
```

## 主要功能

- 在首页点击 'New' 会出现输入框。
- 可以输入一句话。点击 'Post' 按钮即完成发布。
- 如果输入 2 句话（两行，用换行符分隔），第一句会自动成为标题，第二句自动成为内容。
- 如果输入 3 句或以上，内容会以列表形式显示。

## 索引功能

当记录的数量越来越多，怎样才能快速了解数据库的全貌、回想起曾经记录过什么内容呢？
**索引** 就是一个好办法。

- 有一个 Index(索引) 页面，默认取标题的第一个字作为索引，点击可搜索。
- 在 Config(设置) 页面可更改截取标题的字数，比如截取标前的前 2 个字、前 3 个字等。

## 搜索功能

- 在搜索结果中，与标题前缀匹配的排列在最前，
  与标题中间匹配的排列在其后，与 stich(内容) 匹配的排列在最后。
- 简而言之，关键是 “标题的前缀很重要”，既体现在索引中，也体现在搜索结果中。

## 切换数据库

- 这是一个非常方便的功能，让你可以拥有多个互不干扰的数据库，并且可随时切换。
- 在 'Config' 页面的 'DatabasePath' 栏输入一个文件名，点击 'Submit' 按钮即可切换。
- 如果输入的文件名不存在，会自动创建一个新数据库。
- 每个数据库还可以有自己的名称，方便区分。
- 注意：重启程序后会自动打开默认数据库。

## 转移功能

- 在 edit-poem.html 页面有 move 按钮，点击 move 按钮进入 move-poem.html 页面
- 在 move-poem 页面输入另一个数据库的路径，可将当前记录转移到指定数据库中。

## 相关文章

本软件后端采用 Javalin, 前端采用 mj.js, 相关介绍请看以下文章。

- [超简单易用的 Java Web 框架 - Javalin](https://geeknote.net/SuperMild/posts/1428)
- [Javalin网站框架介绍之二 - 数据库](https://geeknote.net/SuperMild/posts/1430)
- [受 Mithril.js 启发的零学习成本极易用框架 - mj.js](https://geeknote.net/SuperMild/posts/1450)
