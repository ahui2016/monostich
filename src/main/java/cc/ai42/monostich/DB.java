package cc.ai42.monostich;

import org.jdbi.v3.core.Handle;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.reflect.ConstructorMapper;

import java.util.List;
import java.util.Optional;

public class DB {
    private final String path;
    private final Jdbi jdbi;

    public String path() {
        return this.path;
    }

    public DB(String dbPath) {
        this.path = dbPath;
        this.jdbi = Jdbi.create("jdbc:sqlite:" + dbPath);
        this.jdbi.useHandle(h -> h.createScript(Stmt.CREATE_TABLES).execute());
        this.jdbi.registerRowMapper(ConstructorMapper.factory(Poem.class));
        initCurrentId();
        initAppConfig();
        initSearchHistory();
    }

    Optional<AppConfig> getAppConfig() {
        var blobOpt = jdbi.withHandle(h -> h.select(Stmt.GET_METADATA)
                .bind("name", Stmt.APP_CONFIG_NAME)
                .mapTo(String.class)
                .findOne());

        if (blobOpt.isEmpty()) return Optional.empty();

        var cfg = AppConfig.fromJSON(blobOpt.orElseThrow());
        return Optional.of(cfg);
    }

    void updateAppConfig(AppConfig cfg) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.UPDATE_METADATA)
                .bind("name", Stmt.APP_CONFIG_NAME)
                .bind("value", cfg.toJSON())
                .execute());
    }

    void initAppConfig() {
        if (getAppConfig().isPresent()) {
            return;
        }
        var cfg = AppConfig.defaultCfg();
        jdbi.useHandle(h -> h.createUpdate(Stmt.INSERT_METADATA)
                .bind("name", Stmt.APP_CONFIG_NAME)
                .bind("value", cfg.toJSON())
                .execute());
    }

    Optional<String[]> getSearchHistory() {
        var historyOpt = jdbi.withHandle(h -> h.select(Stmt.GET_METADATA)
                .bind("name", Stmt.SEARCH_HISTORY)
                .mapTo(String.class)
                .findOne());

        if (historyOpt.isEmpty()) return Optional.empty();

        var history = Util.strArrFromJSON(historyOpt.orElseThrow());
        return Optional.of(history);
    }

    void updateSearchHistory(String[] history) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.UPDATE_METADATA)
                .bind("name", Stmt.SEARCH_HISTORY)
                .bind("value", Util.strArrToJSON(history))
                .execute());
    }

    void initSearchHistory() {
        if (getSearchHistory().isPresent()) {
            return;
        }
        String[] history = {};
        jdbi.useHandle(h -> h.createUpdate(Stmt.INSERT_METADATA)
                .bind("name", Stmt.SEARCH_HISTORY)
                .bind("value", Util.strArrToJSON(history))
                .execute());
    }

    Optional<String> getCurrentId(Handle h) {
    	return h.select(Stmt.GET_METADATA)
    			.bind("name", Stmt.CURRENT_ID_NAME)
    			.mapTo(String.class)
    			.findOne();
    }

    Optional<String> getCurrentId() {
        return jdbi.withHandle(this::getCurrentId);
    }

    void updateCurrentId(Handle h, String id) {
    	h.createUpdate(Stmt.UPDATE_METADATA)
    			.bind("name", Stmt.CURRENT_ID_NAME)
                .bind("value", id)
    			.execute();
    }
    
    String getNextId(Handle h) {
    	var id = getCurrentId(h).orElseThrow();
    	var nextId = ShortID.parse(id).next().toString();
    	updateCurrentId(h, nextId);
    	return nextId;
    }

    void initCurrentId() {
        if (getCurrentId().isPresent()) {
            return;
        }
        var id = ShortID.first().toString();
        jdbi.useHandle(h -> h.createUpdate(Stmt.INSERT_METADATA)
                .bind("name", Stmt.CURRENT_ID_NAME)
                .bind("value", id)
                .execute());
    }

    Poem insertPoem(PoemForm form) {
        return jdbi.withHandle(handle -> handle.inTransaction(h -> {
            var poem = new Poem(getNextId(h), form.title(), form.stich(), Util.now());
            h.createUpdate(Stmt.INSERT_POEM)
                    .bindMap(poem.toMap())
                    .execute();
            return poem;
        }));
    }

    void updatePoem(Poem poem) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.UPDATE_POEM)
                .bindMap(poem.toMap())
                .execute());
    }

    Optional<Poem> getPoem(String id) {
        return jdbi.withHandle(h -> h.select(Stmt.GET_POEM)
                .bind("id", id)
                .mapTo(Poem.class)
                .findOne());
    }

    List<Poem> getRecentPoems() {
        var cfg = getAppConfig().orElseThrow();
        return jdbi.withHandle(h -> h.select(Stmt.GET_RECENT_POEMS)
                .bind("limit", cfg.maxRecent())
                .mapTo(Poem.class)
                .list());
    }

    void deletePoem(String id) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.DELETE_POEM)
                .bind("id", id)
                .execute());
    }

    List<Poem> searchPoems(String pattern) {
        if (pattern.length() == 0) {
            return List.of();
        }
        return jdbi.withHandle(h -> h.select(Stmt.SEARCH_POEMS)
                .bind("title", "%"+pattern+"%")
                .mapTo(Poem.class)
                .list());
    }
}
