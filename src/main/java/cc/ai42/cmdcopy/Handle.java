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
        var data = ctx.bodyAsClass(EntryForm.class);
        var entry = new Entry(
                db.getNextId(),
                data.notes(),
                data.cmd(),
                Util.now());
        db.insertEntry(entry);
        ctx.status(200);
    };

    static Handler getAllEntries = ctx -> {
        var entries = db.getAllEntries();
        ctx.json(entries);
    };
}

record EntryForm(String notes, String cmd) {}

class Util {
    static long now() {
        return Instant.now().getEpochSecond();
    }
}
