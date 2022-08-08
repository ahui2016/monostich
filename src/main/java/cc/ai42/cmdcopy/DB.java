package cc.ai42.cmdcopy;

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

    List<Entry> getAllEntries() {
        return jdbi.withHandle(h -> h.select(Stmt.GET_ALL_ENTRIES)
                .mapTo(Entry.class)
                .list());
    }

    void deleteEntry(String id) {
        jdbi.useHandle(h -> h.createUpdate(Stmt.DELETE_ENTRY)
                .bind("id", id)
                .execute());
    }
}
