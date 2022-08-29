package cc.ai42.monostich;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

record PoemForm(String title, String stich) {}

record PoemGroupForm(String title, String[] poems) {}

record SearchForm(String pattern) {}

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

    static ArrayList<String> strArrToList(String[] strArr) {
        return new ArrayList<>(Arrays.asList(strArr));
    }

    static int strIndexNoCase(String[] strArr, String elem) {
        return Stream.of(strArr).map(String::toUpperCase)
                .toList().indexOf(elem);
    }

    static String[] addOrMoveToTop(String[] strArr, String elem) {
        var strList = strArrToList(strArr);
        var i = strList.indexOf(elem);
        if (i == 0) return strArr;
        if (i > 0) {
            strList.remove(i);
        }
        strList.add(0, elem);
        return strList.toArray(new String[0]);
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