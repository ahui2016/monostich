package cc.ai42.cmdcopy;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

import java.util.Map;

public class App {

    public static void main(String[] args) {

        @SuppressWarnings("resource")
        Javalin app = Javalin.create(config -> {
            config.addStaticFiles(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "src/main/resources/public";
                staticFiles.location = Location.EXTERNAL;
            });
        }).start(7070);

        app.get("/api/hello", ctx -> {
            var result = Map.of("hello", "world");
            ctx.json(result);
        });
    }
}
