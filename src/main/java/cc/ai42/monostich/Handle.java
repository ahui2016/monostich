package cc.ai42.monostich;

import io.javalin.http.Handler;
import io.javalin.http.NotFoundResponse;

import java.time.Instant;

public class Handle {

    static DB db = new DB("db/monostich.sqlite");

    static Handler getAppConfig = ctx -> {
        var cfg = db.getAppConfig().orElseThrow();
        ctx.json(cfg);
    };

    static Handler updateConfig = ctx -> {
        var cfg = ctx.bodyAsClass(AppConfig.class);
        db.updateAppConfig(cfg);
    };

    static Handler insertPoem = ctx -> {
        var form = ctx.bodyAsClass(PoemForm.class);
        var poem = new Poem(
                db.getNextId(),
                form.title(),
                form.stich(),
                Util.now());
        db.insertPoem(poem);
        ctx.json(poem);
    };

    static Handler insertPoemGroup = ctx -> {
        var form = ctx.bodyAsClass(PoemGroupForm.class);
        checkAllPoemsExist(form.poems());
        var group = new PoemGroup(
                RandomID.next(),
                form.title(),
                form.poems(),
                Util.now());
        db.insertPoemGroup(group);
        ctx.json(group);
    };

    static void checkAllPoemsExist(String[] poems) {
        for (var poemID: poems) {
            if (db.getPoem(poemID).isEmpty()) {
                throw new NotFoundResponse("Not Found id: " + poemID);
            }
        }
    }

    static Handler updatePoem = ctx -> {
        var poem = ctx.bodyAsClass(Poem.class);
        db.updatePoem(poem);
    };

    static Handler updatePoemGroup = ctx -> {
        var poemGroup = ctx.bodyAsClass(PoemGroup.class);
        checkAllPoemsExist(poemGroup.poems());
        db.updatePoemGroup(poemGroup);
    };

    static Handler deletePoem = ctx -> {
        var form = ctx.bodyAsClass(IdForm.class);
        var poem = db.getPoem(form.id());
        if (poem.isEmpty()) {
            throw new NotFoundResponse("Not Found id: " + form.id());
        }
        db.deletePoem(form.id());
    };

    static Handler deletePoemGroup = ctx -> {
        var form = ctx.bodyAsClass(IdForm.class);
        var poemGroup = db.getPoemGroup(form.id());
        if (poemGroup.isEmpty()) {
            throw new NotFoundResponse("Not Found id: " + form.id());
        }
        db.deletePoemGroup(form.id());
    };

    static Handler getPoem = ctx -> {
        var form = ctx.bodyAsClass(IdForm.class);
        var poem = db.getPoem(form.id());
        if (poem.isEmpty()) {
            throw new NotFoundResponse("Not Found id: " + form.id());
        }
        ctx.json(poem.orElseThrow());
    };

    static Handler getPoemGroup = ctx -> {
        var form = ctx.bodyAsClass(IdForm.class);
        var poemGroup = db.getPoemGroup(form.id());
        if (poemGroup.isEmpty()) {
            throw new NotFoundResponse("Not Found id: " + form.id());
        }
        ctx.json(poemGroup.orElseThrow());
    };

    static Handler getPoemsByGroup = ctx -> {
        var form = ctx.bodyAsClass(IdForm.class);
        var poems = db.getPoemsByGroupId(form.id());
        ctx.json(poems);
    };

    static Handler getRecentPoems = ctx -> {
        var poems = db.getRecentPoems();
        ctx.json(poems);
    };

    static Handler getRecentGroups = ctx -> {
        var groups = db.getRecentGroups();
        ctx.json(groups);
    };

    static Handler searchPoems = ctx -> {
        var form = ctx.bodyAsClass(SearchForm.class);
        var poems = db.searchPoems(form.pattern());
        ctx.json(poems);
    };
}

record PoemForm(String title, String stich) {}

record PoemGroupForm(String title, String[] poems) {}

record SearchForm(String pattern) {}

record IdForm(String id) {}

class Util {
    static long now() {
        return Instant.now().getEpochSecond();
    }
}
