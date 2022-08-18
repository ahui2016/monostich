package cc.ai42.monostich;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

/**
 * 多条相关命令形成一个组合 (对应数据库的 poemgroup 表)
 * @param id      RandomID
 * @param title   标题（说明/备注）
 * @param poems   一个或多个 Poem 的 id
 * @param created 创建时间
 */
public record PoemGroup(String id, String title, String[] poems, long created) {
    Map<String, Object> toMap() {
        try {
            return Map.of(
                    "id", id,
                    "title", title,
                    "poems", new ObjectMapper().writeValueAsBytes(poems),
                    "created", created
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("StichGroup.toMap: " + e + id + title);
        }
    }
}

class PoemGroupMapper implements RowMapper<PoemGroup> {
    @Override
    public PoemGroup map(ResultSet rs, StatementContext ctx) throws SQLException {
        var id = rs.getString("id");
        var title = rs.getString("title");
        var blob = rs.getBytes("poems");
        String[] poems;
        try {
            poems = new ObjectMapper().readValue(blob, String[].class);
        } catch (IOException e) {
            throw new RuntimeException("PoemGroupMapper.map: " + e + id + title);
        }
        var created = rs.getLong("created");
        return new PoemGroup(id, title, poems, created);
    }
}
