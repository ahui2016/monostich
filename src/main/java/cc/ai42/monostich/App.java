package cc.ai42.monostich;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

public class App {
    public static void main(String[] args) {
        @SuppressWarnings("resource")
        Javalin app = Javalin.create(config -> {
            config.addStaticFiles(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "src/main/resources/public";
                staticFiles.location = Location.EXTERNAL;
//                staticFiles.directory = "/public";
//                staticFiles.location = Location.CLASSPATH;
            });
        }).start(7070);

        Print.ln("Database -> " + Handle.db.path());

        app.post("/api/insert-poem", Handle.insertPoem);
        app.get("/api/recent-poems", Handle.getRecentPoems);
        app.post("/api/search", Handle.searchPoems);
    }
}
