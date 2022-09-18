package cc.ai42.monostich;

import java.util.Map;

/**
 * 一条命令 (对应数据库的 poem 表)
 * @param id      采用 ShortID
 * @param title   标题（说明/备注）
 * @param stich   一句话（例如一条命令、一个网址、一句备忘等等）
 * @param created 创建时间
 */
public record Poem(String id, String title, String stich, long created) {
    Map<String, Object> toMap() {
        return Map.of(
                "id", id,
                "title", title,
                "stich", stich,
                "created", created
        );
    }

    PoemForm toForm() {
        return new PoemForm(title, stich);
    }
}
