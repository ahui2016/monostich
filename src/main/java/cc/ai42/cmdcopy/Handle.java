package cc.ai42.cmdcopy;

import io.javalin.http.Handler;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class Handle {

    static DB db = new DB("db/cmdcopy.sqlite");

    static Handler hello = ctx -> {
        var result = Map.of("hello", "world");
        ctx.json(result);
    };

    static void testDB() {
        // insert entries
        for (var entry: Mock.entries) {
            db.insertEntry(entry);
        }

        // get and print entries
        var entries = db.getAllEntries();
        for (var entry: entries) {
            Print.ln(entry.toString());
        }

        // delete entries
        for (var entry: Mock.entries) {
            db.deleteEntry(entry.id());
        }

        var emptyEntries = db.getAllEntries();
        Print.ln("size: " + emptyEntries.size());
    }
}

class Mock {

    static long now() {
        return Instant.now().getEpochSecond();
    }

    static List<Entry> entries = List.of(
            new Entry("a", "aaa", "aaa aaa aaa", now()),
            new Entry("b", "bbb", "bbb bbb bbb", now()),
            new Entry("c", "ccc", "ccc ccc ccc", now())
    );
}
