package cc.ai42.cmdcopy;

/**
 * 一条命令 (对应数据库的 cmdentry 表)
 * @param id      采用 ShortID
 * @param notes   说明/备注
 * @param cmd     命令本身
 * @param created 创建时间
 */
record Entry(String id, String notes, String cmd, long created) {
}

/**
 * 多条相关命令形成一个组合 (对应数据库的 cmdgroup 表)
 * @param id      RandomID
 * @param notes   说明/备注
 * @param entries 命令 Entry 的 id
 * @param created 创建时间
 */
record GroupOfEntryID(String id, String notes, String[] entries, long created) {
}

/**
 * 多条相关命令形成一个组合 (用于前端展示数据)
 * @param id      RandomID
 * @param notes   说明/备注
 * @param entries Entry
 * @param created 创建时间
 */
record GroupOfEntry(String id, String notes, Entry[] entries, long created) {
}
