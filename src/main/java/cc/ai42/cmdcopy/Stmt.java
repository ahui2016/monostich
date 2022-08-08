package cc.ai42.cmdcopy;

public class Stmt {
    public static final String CREATE_TABLES = """
        CREATE TABLE IF NOT EXISTS cmdentry
        (
          id        TEXT   PRIMARY KEY COLLATE NOCASE,
          notes     TEXT   NOT NULL,
          cmd       TEXT   NOT NULL,
          created   INT    NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_cmdentry_created ON cmdentry(created);
        
        CREATE TABLE IF NOT EXISTS cmdgroup
        (
          id        TEXT   PRIMARY KEY COLLATE NOCASE,
          notes     TEXT   NOT NULL,
          entries   BLOB   NOT NULL,
          created   INT    NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_cmdgroup_created ON cmdgroup(created);
        """;

    public static final String INSERT_ENTRY = """
        INSERT INTO cmdentry (id, notes, cmd, created)
        VALUES (:id, :notes, :cmd, :created);
        """;

    public static final String GET_ENTRY = """
        SELECT * FROM cmdentry WHERE id = :id;
        """;

    public static final String GET_ALL_ENTRIES = """
        SELECT * FROM cmdentry;
        """;

    public static final String DELETE_ENTRY = """
        DELETE FROM cmdentry WHERE id = :id;
        """;
}
