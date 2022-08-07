package cc.ai42.cmdcopy;

import org.jdbi.v3.core.Jdbi;

public class DB {
    private final String dbPath;
    private final Jdbi jdbi;

    public DB(String dbPath) {
        this.dbPath = dbPath;
        this.jdbi = Jdbi.create("jdbc:sqlite:" + dbPath);
        this.jdbi.useHandle(h -> h.createScript(Stmt.CREATE_TABLES).execute());
    }
}
