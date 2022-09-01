package cc.ai42.monostich;

import io.javalin.http.Handler;
import io.javalin.http.InternalServerErrorResponse;
import io.javalin.http.NotFoundResponse;

import java.nio.file.Path;

public class Handle {

    static DB db = new DB("db/monostich.db");

    static Handler getDBPath = ctx -> {
        var dbPath = Path.of(db.path()).toAbsolutePath().toString();
        ctx.json(new FormStr1(dbPath));
    };

    static Handler changeDB = ctx -> {
        var form = ctx.bodyAsClass(FormStr1.class);
        var dbPath = Path.of(db.path()).toAbsolutePath();
        var dbPath2 = Path.of(form.val()).toAbsolutePath();
        if (dbPath2.toFile().isDirectory()) {
            throw new InternalServerErrorResponse(dbPath2+" 是文件夹。");
        }
        if (!dbPath2.getParent().toFile().exists()) {
            throw new InternalServerErrorResponse(dbPath2.getParent().toString()+" 不存在。");
        }
        if (dbPath.equals(dbPath2)) return;
        db = new DB(dbPath2.toString());
    };

    static Handler getAppConfig = ctx -> {
        var cfg = db.getAppConfig().orElseThrow();
        ctx.json(cfg);
    };

    static Handler updateConfig = ctx -> {
        var cfg = ctx.bodyAsClass(AppConfig.class);
        db.updateAppConfig(cfg);
    };

    static Handler getSearchHistory = ctx -> {
        var history = new String[0];
        var cfg = db.getAppConfig().orElseThrow();
        if (cfg.showSearchHistory()) {
            history = db.getSearchHistory().orElseThrow();
        }
        ctx.json(history);
    };

    static Handler pushSearchHistory = ctx -> {
        var form = ctx.bodyAsClass(FormStr1.class);
        var searchHistory = db.getSearchHistory().orElseThrow();
        var history = new SearchHistory(searchHistory);
        history.push(form.val());
        searchHistory = history.toArray();
        db.updateSearchHistory(searchHistory);
        var cfg = db.getAppConfig().orElseThrow();
        if (!cfg.showSearchHistory()) {
            searchHistory = new String[0];
        }
        ctx.json(searchHistory);
    };

    static Handler clearSearchHistory = ctx ->
            db.updateSearchHistory(new String[0]);

    static Handler insertPoem = ctx -> {
        var form = ctx.bodyAsClass(PoemForm.class);
        var poem = db.insertPoem(form);
        ctx.json(poem);
    };

    static Handler updatePoem = ctx -> {
        var poem = ctx.bodyAsClass(Poem.class);
        db.updatePoem(poem);
    };

    static Handler deletePoem = ctx -> {
        var form = ctx.bodyAsClass(IdForm.class);
        var poem = db.getPoem(form.id());
        if (poem.isEmpty()) {
            throw new NotFoundResponse("Not Found id: " + form.id());
        }
        db.deletePoem(form.id());
    };

    static Handler getPoem = ctx -> {
        var form = ctx.bodyAsClass(IdForm.class);
        var poem = db.getPoem(form.id());
        if (poem.isEmpty()) {
            throw new NotFoundResponse("Not Found id: " + form.id());
        }
        ctx.json(poem.orElseThrow());
    };

    static Handler getRecentPoems = ctx -> {
        var poems = db.getRecentPoems();
        ctx.json(poems);
    };

    static Handler searchPoems = ctx -> {
        var form = ctx.bodyAsClass(FormStr1.class);
        var poems = db.searchPoems(form.val());
        ctx.json(poems);
    };

    static Handler getTruncatedTitles = ctx -> {
        var form = ctx.bodyAsClass(FormInt1.class);
        var n = form.val();
        ctx.json(db.getTruncatedTitles(n));
    };
}
