package cc.ai42.cmdcopy;

/**
 * 多条相关命令形成一个组合 (用于前端展示数据)
 * @param id      RandomID
 * @param notes   说明/备注
 * @param entries Entry
 * @param created 创建时间
 */
public record EntryGroup(String id, String notes, Entry[] entries, long created) {
}
