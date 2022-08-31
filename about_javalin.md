# Javalin - 发现 Java 的可爱之处

多年以前我看到一篇神奇的文章 [Java for Everything](https://www.teamten.com/lawrence/writings/java-for-everything.html),
其中提出了一个大胆的想法：就连脚本小工具都用 Java 来写。

我读了这篇文章，但并没有立即使用 Java, 而是写了一段时间 Go, 又写了一段时间 Python,
最近想起这篇文章，就想用 Java 写点东西。

## Java 的优点

1. 易学 (而且程序员几乎都或多或少已经学过), 学习资料丰富
2. 工具齐全 (比如有 IntelliJ IDEA, 有 maven)
3. 生态强大，第三方库丰富
4. 稳重感、安心感。 Java 经过了多年工业级考验，能带给我很 "稳" 的心理暗示，
   有一种脚踏实地的安全感。

## Java 的缺点

本来 Java 是很啰嗦的，这是它最被诟病的地方了。

但现在 Java 有了 record, lambda, Stream API, var(类型推断) 等等，
已经变得不是太啰嗦了，根据我狭隘的个人经验，甚至认为比 Go, Python 更简洁。

- Python 我为了获得静态类型的好处，就试着老老实实用 type hints,
  但用着用着发现，毕竟不是天生静态类型，有很多不方便的地方，而且这样做之后，
  代码再也不简短了，经常要带着一大堆 type hints, 很麻烦。
- Go 由于泛型还不完善，加上 `if err != nil`, 代码是很简明易懂，
  但论代码的简短，也是经常比不上 Java。
- 但我说 Java 不啰嗦，前提是我只是轻度使用，较少遇到必须用 Java Bean,
  或不能用 Stream API 的情况。只要能把 record, lambda, Stream API,
  var(类型推断) 等等尽量用上, Java 就不啰嗦了。

## Monostich (单行诗)

以前我喜欢用 Go 来做一些自用的小软件，做一个本地网站通过访问网页来使用，
最近想做一个叫 monostich 的小工具，就尝试用 Java 来做。

### 主要功能

monostich 的功能非常简单。

- 在首页点击 'New' 跳转到 '新增一条记录' 页面。
- 输入标题和内容，点击 'Submit' 按钮，搞定。
- 其中，标题是用来方便搜索的，内容则是任意一句话（例如一条命令、一个网址、一句备忘等等）
- 首页有一个搜索框和最近新增项目列表。

## 与 Go 语言代码对比

这次我用 Javalin 来做本地网站，并且采用了以前我写 Go 时的代码组织方式，
因此两种语言可以做个对比。

### 程序入口: main.go 与 Main.java 对比

可见, Go 与 Java 的代码几乎一模一样：

```go
// github.com/ahui2016/dictplus/blob/main/main.go

func main() {
	e := echo.New()
	e.Static("/public", "public")
	e.File("/", "public/index.html")

	api := e.Group("/api", sleep)
	api.POST("/get-word", getWordHandler)
	api.POST("/add-word", addWordHandler)
	api.POST("/update-word", updateWordHandler)
	api.POST("/delete-word", deleteWordHandler)
	api.POST("/search-words", searchHandler)

	e.Logger.Fatal(e.Start(*addr))
}
```

```java
// github.com/ahui2016/monostich/.../App.java

public class App {
    public static void main(String[] args) {
        Javalin app = Javalin.create(config ->
            config.addStaticFiles(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "/public";
                staticFiles.location = Location.CLASSPATH;
            })).start(port);
    
        app.post("/api/insert-poem", Handle.insertPoem);
        app.post("/api/update-poem", Handle.updatePoem);
        app.post("/api/delete-poem", Handle.deletePoem);
        app.post("/api/get-poem", Handle.getPoem);
        app.post("/api/search-poems", Handle.searchPoems);
    }
}
```

### Handler

可见, Go 比 Java 多了一些 `if err != nil`, 其余代码几乎一模一样：

```go
// github.com/ahui2016/dictplus/blob/main/handler.go

func addWordHandler(c echo.Context) error {
	w := new(Word)
	if err := c.Bind(w); err != nil {
		return err
	}
	if err := db.InsertNewWord(w); err != nil {
		return err
	}
	return c.JSON(OK, Text{w.ID})
}
```

```java
// github.com/ahui2016/monostich/.../Handle.java

static Handler insertPoem = ctx -> {
    var form = ctx.bodyAsClass(PoemForm.class);
    var poem = db.insertPoem(form);
    ctx.json(poem);
};
```

### 数据库

在上面 Handler 的代码中, db.InsertNewWord() 与 db.insertPoem() 的具体实现如下所示。

可以看到, Go 的代码还是受到了 `if err != nil` 的困扰，显得很啰嗦，
而 Java 采用 Stream API 的好处是非常明显的，代码简洁了很多。

```go
// github.com/ahui2016/dictplus/.../database.go

func (db *DB) InsertNewWord(w *Word) (err error) {
	tx := db.mustBegin()
	defer tx.Rollback()

	if w.ID, err = getNextID(tx, word_id_key); err != nil {
		return
	}
	w.CTime = util.TimeNow()
	if err = insertWord(tx, w); err != nil {
		return
	}
	err = tx.Commit()
	return
}
```

```java
// github.com/ahui2016/monostich/.../DB.java

Poem insertPoem(PoemForm form) {
    return jdbi.withHandle(handle -> handle.inTransaction(h -> {
        var poem = new Poem(getNextId(h), form.title(), form.stich(), Util.now());
        h.createUpdate(Stmt.INSERT_POEM)
                .bindMap(poem.toMap())
                .execute();
        return poem;
    }));
}
```

## 相关链接

本软件后端采用 Javalin, 前端采用 mj.js, 相关介绍请看以下链接。

- [Javalin 官网](https://javalin.io/)
- [Monostich 源码仓库](https://github.com/ahui2016/monostich/)
- [超简单易用的 Java Web 框架 - Javalin](https://geeknote.net/SuperMild/posts/1428)
- [Javalin网站框架介绍之二 - 数据库](https://geeknote.net/SuperMild/posts/1430)
- [受 Mithril.js 启发的零学习成本极易用框架 - mj.js](https://geeknote.net/SuperMild/posts/1450)