package cc.ai42.cmdcopy;

import java.time.LocalDate;

/**
 * 该 ID 由年份与自增数两部分组成，年份与自增数分别转 36 进制字符，不分大小写。
 */
public record ShortID(int year, int n) {

    public static ShortID first() {
        return new ShortID(LocalDate.now().getYear(), 0);
    }

    // 有“万年虫”问题，大概公元五万年时本算法会出错。
    public static ShortID parse(String id) {
        // 姑且可以认为年份总是占三个字符
        var year = Integer.parseInt(id.substring(0, 3), 36);
        var n = Integer.parseInt(id.substring(3), 36);
        return new ShortID(year, n);
    }

    public ShortID next() {
        var nowYear = LocalDate.now().getYear();
        if (nowYear > year) return new ShortID(nowYear, 0);
        return new ShortID(year, n + 1);
    }

    @Override
    public String toString() {
        var head = Integer.toString(year, 36);
        var tail = Integer.toString(n, 36);
        return (head + tail).toUpperCase();
    }
}
