package cc.ai42.cmdcopy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

/**
 * 多条相关命令形成一个组合 (对应数据库的 cmdgroup 表)
 * @param id      RandomID
 * @param notes   说明/备注
 * @param entries 命令 Entry 的 id
 * @param created 创建时间
 */
public record CmdGroup(String id, String notes, String[] entries, long created) {
    Map<String, Object> toMap() {
        try {
            return Map.of(
                    "id", id,
                    "notes", notes,
                    "entries", new ObjectMapper().writeValueAsBytes(entries),
                    "created", created
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("CmdGroup.toMap: " + e + id + notes);
        }
    }
}

class CmdGroupMapper implements RowMapper<CmdGroup> {
    @Override
    public CmdGroup map(ResultSet rs, StatementContext ctx) throws SQLException {
        var id = rs.getString("id");
        var notes = rs.getString("notes");
        var blob = rs.getBytes("entries");
        String[] entries;
        try {
            entries = new ObjectMapper().readValue(blob, String[].class);
        } catch (IOException e) {
            throw new RuntimeException("CmdGroupMapper.map: " + e + id + notes);
        }
        var created = rs.getLong("created");
        return new CmdGroup(id, notes, entries, created);
    }
}
