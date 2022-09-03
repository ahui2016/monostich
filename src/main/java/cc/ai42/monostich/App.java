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
        Javalin app = Javalin.create(config ->
                config.addStaticFiles(staticFiles -> {
                    staticFiles.hostedPath = "/";
/*
                    staticFiles.directory = "src/main/resources/public";
                    staticFiles.location = Location.EXTERNAL;
*/
                    staticFiles.directory = "/public";
                    staticFiles.location = Location.CLASSPATH;
                })).start(port);

        Print.ln("Database -> " + Handle.db.path());

        app.get("/api/get-db-path", Handle.getDBPath);
        app.post("/api/change-db", Handle.changeDB);

        app.get("/api/get-config", Handle.getAppConfig);
        app.post("/api/update-config", Handle.updateConfig);

        app.get("/api/get-search-history", Handle.getSearchHistory);
        app.post("/api/push-search-history", Handle.pushSearchHistory);
        app.get("/api/clear-search-history", Handle.clearSearchHistory);

        app.post("/api/insert-poem", Handle.insertPoem);
        app.post("/api/update-poem", Handle.updatePoem);
        app.post("/api/delete-poem", Handle.deletePoem);
        app.post("/api/get-poem", Handle.getPoem);
        app.get("/api/recent-poems", Handle.getRecentPoems);

        app.post("/api/search-poems", Handle.searchPoems);
        app.post("/api/get-truncated-titles", Handle.getTruncatedTitles);
    }
}
