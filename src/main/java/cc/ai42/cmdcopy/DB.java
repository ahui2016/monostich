package cc.ai42.cmdcopy;

import com.fasterxml.jackson.databind.ObjectMapper;
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
        this.jdbi.registerRowMapper(ConstructorMapper.factory(Entry.class));
        initCurrentId();
        initAppConfig();
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

    void insertEntry(Entry entry) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.INSERT_ENTRY)
                .bindMap(entry.toMap())
                .execute());
    }

    Optional<Entry> getEntry(String id) {
        return jdbi.withHandle(h -> h.select(Stmt.GET_ENTRY)
                .bind("id", id)
                .mapTo(Entry.class)
                .findOne());
    }

    List<Entry> getRecentEntries() {
        var cfg = getAppConfig().orElseThrow();
        return jdbi.withHandle(h -> h.select(Stmt.GET_RECENT_ENTRIES)
                .bind("limit", cfg.maxRecent())
                .mapTo(Entry.class)
                .list());
    }

    void deleteEntry(String id) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.DELETE_ENTRY)
                .bind("id", id)
                .execute());
    }

    List<Entry> searchEntries(String pattern) {
        if (pattern.length() == 0) {
            return List.of();
        }
        return jdbi.withHandle(h -> h.select(Stmt.SEARCH_ENTRIES)
                .bind("notes", "%"+pattern+"%")
                .mapTo(Entry.class)
                .list());
    }
}
