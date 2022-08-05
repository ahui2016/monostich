package cc.ai42.cmdcopy;

import io.javalin.Javalin;

public class App {

    public static void main(String[] args) {

        @SuppressWarnings("resource")
        Javalin app = Javalin.create().start(7070);

        app.get("/", ctx -> ctx.result("Hello World"));
    }
}
