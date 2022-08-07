package cc.ai42.cmdcopy;

import io.javalin.http.Handler;

import java.util.Map;

public class Handle {

    static DB db = new DB("db/cmdcopy.sqlite");

    static Handler hello = ctx -> {
        var result = Map.of("hello", "world");
        ctx.json(result);
    };
}
