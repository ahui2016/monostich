package cc.ai42.cmdcopy;

import java.security.SecureRandom;
import java.time.Instant;

/**
 * RandomID 返回一个上升趋势的随机 id, 由时间戳与随机数组成。
 * 时间戳确保其上升趋势（大致有序），随机数确保其随机性（防止被穷举, 防冲突）。
 */
public class RandomID {
    public static String next() {
        long max = 100_000;
        long n = new SecureRandom().nextLong(max);
        long unixTime =  Instant.now().getEpochSecond();
        long id = unixTime * max + n;
        return Long.toString(id, 36);
    }
}
