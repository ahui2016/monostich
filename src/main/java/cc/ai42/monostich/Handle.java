package cc.ai42.monostich;

import io.javalin.http.Handler;

import java.time.Instant;

public class Handle {

    static DB db = new DB("db/monostich.sqlite");

    static Handler insertPoem = ctx -> {
        var form = ctx.bodyAsClass(PoemForm.class);
        var poem = new Poem(
                db.getNextId(),
                form.title(),
                form.stich(),
                Util.now());
        db.insertPoem(poem);
        ctx.json(poem);
    };

    static Handler getRecentPoems = ctx -> {
        var poems = db.getRecentPoems();
        ctx.json(poems);
    };

    static Handler searchPoems = ctx -> {
        var form = ctx.bodyAsClass(SearchForm.class);
        var poems = db.searchPoems(form.pattern());
        ctx.json(poems);
    };
}

record PoemForm(String title, String stich) {}

record SearchForm(String pattern) {}

class Util {
    static long now() {
        return Instant.now().getEpochSecond();
    }
}
