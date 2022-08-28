package cc.ai42.monostich;

import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.reflect.ConstructorMapper;

import java.util.ArrayList;
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

        var history = Util.StrArrFromJSON(historyOpt.orElseThrow());
        return Optional.of(history);
    }

    void updateSearchHistory(String[] history) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.UPDATE_METADATA)
                .bind("name", Stmt.SEARCH_HISTORY)
                .bind("value", Util.StrArrToJSON(history))
                .execute());
    }

    void initSearchHistory() {
        if (getSearchHistory().isPresent()) {
            return;
        }
        String[] history = {};
        jdbi.useHandle(h -> h.createUpdate(Stmt.INSERT_METADATA)
                .bind("name", Stmt.SEARCH_HISTORY)
                .bind("value", Util.StrArrToJSON(history))
                .execute());
    }

    Optional<String> getCurrentId() {
    	return jdbi.withHandle(h -> h.select(Stmt.GET_METADATA)
    			.bind("name", Stmt.CURRENT_ID_NAME)
    			.mapTo(String.class)
    			.findOne());
    }
    
    void updateCurrentId(String id) {
    	jdbi.useHandle(h -> h.createUpdate(Stmt.UPDATE_METADATA)
    			.bind("name", Stmt.CURRENT_ID_NAME)
                .bind("value", id)
    			.execute());
    }
    
    String getNextId() {
    	var id = getCurrentId().orElseThrow();
    	var nextId = ShortID.parse(id).next().toString();
    	updateCurrentId(nextId);
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

    void insertPoem(Poem poem) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.INSERT_POEM)
                .bindMap(poem.toMap())
                .execute());
    }

    void insertPoemGroup(PoemGroup poemGroup) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.INSERT_GROUP)
                .bindMap(poemGroup.toMap())
                .execute());
    }

    void updatePoem(Poem poem) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.UPDATE_POEM)
                .bindMap(poem.toMap())
                .execute());
    }

    void updatePoemGroup(PoemGroup poemGroup) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.UPDATE_POEMGROUP)
                .bindMap(poemGroup.toMap())
                .execute());
    }

    Optional<Poem> getPoem(String id) {
        return jdbi.withHandle(h -> h.select(Stmt.GET_POEM)
                .bind("id", id)
                .mapTo(Poem.class)
                .findOne());
    }

    Optional<PoemGroup> getPoemGroup(String id) {
        return jdbi.withHandle(h -> h.select(Stmt.GET_POEMGROUP)
                .bind("id", id)
                .map(new PoemGroupMapper())
                .findOne());
    }

    List<Poem> getPoemsByGroupId(String id) {
        var poemGroup = getPoemGroup(id).orElseThrow();
        var poems = new ArrayList<Poem>();
        for (var poemID: poemGroup.poems()) {
            var poem = jdbi.withHandle(h -> h.select(Stmt.GET_POEM)
                    .bind("id", poemID)
                    .mapTo(Poem.class)
                    .findOne());
            if (poem.isEmpty()) {
                poems.add(new Poem(poemID, poemID, poemID, 0));
            } else {
                poems.add(poem.orElseThrow());
            }
        }
        return poems;
    }

    List<Poem> getRecentPoems() {
        var cfg = getAppConfig().orElseThrow();
        return jdbi.withHandle(h -> h.select(Stmt.GET_RECENT_POEMS)
                .bind("limit", cfg.maxRecent())
                .mapTo(Poem.class)
                .list());
    }

    List<PoemGroup> getRecentGroups() {
        var cfg = getAppConfig().orElseThrow();
        return jdbi.withHandle(h -> h.select(Stmt.GET_RECENT_GROUPS)
                .bind("limit", cfg.maxRecent())
                .map(new PoemGroupMapper())
                .list());
    }

    void deletePoem(String id) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.DELETE_POEM)
                .bind("id", id)
                .execute());
    }

    void deletePoemGroup(String id) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.DELETE_POEMGROUP)
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

    List<PoemGroup> searchGroups(String pattern) {
        if (pattern.length() == 0) {
            return List.of();
        }
        return jdbi.withHandle(h -> h.select(Stmt.SEARCH_GROUPS)
                .bind("title", "%"+pattern+"%")
                .map(new PoemGroupMapper())
                .list());
    }
}
