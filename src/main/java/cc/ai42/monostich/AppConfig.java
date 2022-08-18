package cc.ai42.monostich;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public record AppConfig(
        int maxRecent // 最近项目列表条数上限
) {
    public static AppConfig defaultCfg() {
        return new AppConfig(50);
    }

    public static AppConfig fromJSON(String blob) {
        try {
            return new ObjectMapper().readValue(blob, AppConfig.class);
        } catch (IOException e) {
            throw new RuntimeException("AppConfig.of(): " + e);
        }
    }

    public String toJSON() {
        try {
            return new ObjectMapper().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("AppConfig.toJSON" + e);
        }
    }
}
