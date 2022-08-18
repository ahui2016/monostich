package cc.ai42.cmdcopy;

public class Stmt {
    public static final String CREATE_TABLES = """
		CREATE TABLE IF NOT EXISTS metadata
		(
		  name    TEXT   NOT NULL UNIQUE,
		  value   TEXT   NOT NULL
		);

        CREATE TABLE IF NOT EXISTS cmdentry
        (
          id        TEXT   PRIMARY KEY COLLATE NOCASE,
          notes     TEXT   NOT NULL,
          cmd       TEXT   NOT NULL,
          created   INT    NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_cmdentry_notes ON cmdentry(notes);
        CREATE INDEX IF NOT EXISTS idx_cmdentry_created ON cmdentry(created);
        
        CREATE TABLE IF NOT EXISTS cmdgroup
        (
          id        TEXT   PRIMARY KEY COLLATE NOCASE,
          notes     TEXT   NOT NULL,
          entries   BLOB   NOT NULL,
          created   INT    NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_cmdgroup_notes ON cmdgroup(notes);
        CREATE INDEX IF NOT EXISTS idx_cmdgroup_created ON cmdgroup(created);
        """;

    public static final String CURRENT_ID_NAME = "current-id";
    public static final String APP_CONFIG_NAME = "app-config";

    public static final String INSERT_METADATA = """
        INSERT INTO metadata (name, value) VALUES (:name, :value);
        """;

    public static final String GET_METADATA = """
        SELECT value FROM metadata WHERE name = :name;
        """;

    public static final String UPDATE_METADATA = """
		UPDATE metadata SET value=:value WHERE name=:name;
		""";

    public static final String INSERT_ENTRY = """
        INSERT INTO cmdentry (id, notes, cmd, created)
        VALUES (:id, :notes, :cmd, :created);
        """;

    public static final String GET_ENTRY = """
        SELECT * FROM cmdentry WHERE id = :id;
        """;

    public static final String GET_RECENT_ENTRIES = """
        SELECT * FROM cmdentry ORDER BY created DESC LIMIT :limit;
        """;

    public static final String DELETE_ENTRY = """
        DELETE FROM cmdentry WHERE id = :id;
        """;

    public static final String SEARCH_ENTRIES = """
        SELECT * FROM cmdentry WHERE notes LIKE :notes
        ORDER BY created DESC;
        """;
}
