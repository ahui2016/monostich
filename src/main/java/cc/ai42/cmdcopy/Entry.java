package cc.ai42.cmdcopy;

import java.util.Map;

/**
 * 一条命令 (对应数据库的 cmdentry 表)
 * @param id      采用 ShortID
 * @param notes   说明/备注
 * @param cmd     命令本身
 * @param created 创建时间
 */
public record Entry(String id, String notes, String cmd, long created) {
	Map<String, Object> toMap() {
        return Map.of(
                "id", id,
                "notes", notes,
                "cmd", cmd,
                "created", created
        );
    }
}
