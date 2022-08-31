package cc.ai42.monostich;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Arrays;

record PoemForm(String title, String stich) {}

/**
 * 意思是这个 Form 有一个类型为 String 的属性。
 * @param val
 */
record FormStr1(String val) {}

record IdForm(String id) {}

class Util {
    static long now() {
        return Instant.now().getEpochSecond();
    }

    static String[] strArrFromJSON(String blob) {
        try {
            return new ObjectMapper().readValue(blob, String[].class);
        } catch (IOException e) {
            throw new RuntimeException("StrListFromJSON(): " + e);
        }
    }

    static String strArrToJSON(String[] strArr) {
        try {
            return new ObjectMapper().writeValueAsString(strArr);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("StrArrToJSON(): " + e);
        }
    }
}

class SearchHistory {
    int maxSearchHistory = 20; // 搜索历史条数上限

    private final ArrayDeque<String> history;

    public SearchHistory() {
        this.history = new ArrayDeque<>();
    }

    /**
     * 输入一个 String[], 在内部转化为一个先入先出的队列进行处理。
     */
    public SearchHistory(String[] history) {
        this.history = new ArrayDeque<>(Arrays.asList(history));
    }

    void clear() {
        history.clear();
    }

    /**
     * 添加元素，但如果元素已存在则是移动元素到末尾。当 size 超过上限时，删除第一个元素。
     */
    void push(String e) {
        history.removeIf(x -> x.equalsIgnoreCase(e));
        history.addLast(e);
        if (history.size() > maxSearchHistory) history.removeFirst();
    }

    String[] toArray() {
        return history.toArray(new String[0]);
    }
}