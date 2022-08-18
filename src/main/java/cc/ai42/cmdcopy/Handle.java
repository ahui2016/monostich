package cc.ai42.cmdcopy;

import io.javalin.http.Handler;

import java.time.Instant;
import java.util.Map;

public class Handle {

    static DB db = new DB("db/cmdcopy.sqlite");

    static Handler hello = ctx -> {
        var result = Map.of("hello", "world");
        ctx.json(result);
    };

    static Handler addEntry = ctx -> {
        var form = ctx.bodyAsClass(EntryForm.class);
        var entry = new Entry(
                db.getNextId(),
                form.notes(),
                form.cmd(),
                Util.now());
        db.insertEntry(entry);
        ctx.json(entry);
    };

    static Handler getRecentEntries = ctx -> {
        var entries = db.getRecentEntries();
        ctx.json(entries);
    };

    static Handler searchEntries = ctx -> {
        var form = ctx.bodyAsClass(SearchForm.class);
        var entries = db.searchEntries(form.pattern());
        ctx.json(entries);
    };
}

record EntryForm(String notes, String cmd) {}

record SearchForm(String pattern) {}

class Util {
    static long now() {
        return Instant.now().getEpochSecond();
    }
}
