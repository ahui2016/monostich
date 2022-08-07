package cc.ai42.cmdcopy;

public class Stmt {
    public static final String CREATE_TABLES = """
        CREATE TABLE IF NOT EXISTS cmdentry
        (
          id        text   PRIMARY KEY COLLATE NOCASE,
          notes     text   NOT NULL,
          cmd       text   NOT NULL,
          created   int    NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_cmdentry_created ON cmdentry(created);
        
        CREATE TABLE IF NOT EXISTS cmdgroup
        (
          id        text   PRIMARY KEY COLLATE NOCASE,
          notes     text   NOT NULL,
          entries   blob   NOT NULL,
          created   int    NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_cmdgroup_created ON cmdgroup(created);
        """;
}
