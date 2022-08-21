package cc.ai42.monostich;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

public class App {
    public static void main(String[] args) {
        int port = 7070;
        if (args.length > 0) {
            port = Integer.parseInt(args[0]);
        }
        @SuppressWarnings("resource")
        Javalin app = Javalin.create(config -> {
            config.addStaticFiles(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "src/main/resources/public";
                staticFiles.location = Location.EXTERNAL;
//                staticFiles.directory = "/public";
//                staticFiles.location = Location.CLASSPATH;
            });
        }).start(port);

        Print.ln("Database -> " + Handle.db.path());

        app.post("/api/insert-poem", Handle.insertPoem);
        app.post("/api/get-poem", Handle.getPoem);
        app.get("/api/recent-poems", Handle.getRecentPoems);
        app.post("/api/search", Handle.searchPoems);
    }
}
