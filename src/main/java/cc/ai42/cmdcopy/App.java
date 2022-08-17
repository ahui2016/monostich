package cc.ai42.cmdcopy;

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

        app.get("/api/hello", Handle.hello);
        app.post("/api/add-entry", Handle.addEntry);
        app.get("/api/all-entries", Handle.getAllEntries);

    }
}
