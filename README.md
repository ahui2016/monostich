# monostich (单行诗)

本项目原名 cmdcopy, 主要用途是记录和复制 CLI 命令，
后来想扩展用途，用来记录任意一句话（例如一条命令、一个网址、一句备忘等等），
因此改名为 monostich。

## 安装

- <https://docs.aws.amazon.com/corretto/index.html>
- <https://maven.apache.org/install.html>

### 手动创建 db 文件夹

```text
Exception in thread "main" java.lang.ExceptionInInitializerError
        at cc.ai42.monostich.App.main(App.java:19)
Caused by: org.jdbi.v3.core.ConnectionException: java.sql.SQLException: path to 'db/monostich.sqlite': '/path/to/monostich/db' does not exist
```

### 功能

- 默认前缀检索，可选包含检索。

### 设计

- 标题允许重复
- group 里的项目 ID 允许重复

### 夸 Java

- 用 Javalin 和 jdbi, 学习量非常少，分别只有一页内容
- 不用 Spring 和 bean
