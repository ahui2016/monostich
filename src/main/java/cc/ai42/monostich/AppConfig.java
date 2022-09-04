package cc.ai42.monostich;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public record AppConfig(
        int maxRecent, // 最近项目列表条数上限
        boolean showSearchHistory, // 是否展示最近搜索历史
        int indexTitleLength, // 索引标题的截取长度
        String databaseName, // 数据库名称，可留空
        boolean showDatabaseName // 是否在首页显示数据库名称
) {
    public static AppConfig defaultCfg() {
        return new AppConfig(
                50,
                true,
                1,
                "",
                true
        );
    }

    public static AppConfig fromJSON(String blob) {
        try {
            return new ObjectMapper().readValue(blob, AppConfig.class);
        } catch (IOException e) {
            throw new RuntimeException("AppConfig.fromJSON(): " + e);
        }
    }

    public String toJSON() {
        try {
            return new ObjectMapper().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("AppConfig.toJSON(): " + e);
        }
    }
}
