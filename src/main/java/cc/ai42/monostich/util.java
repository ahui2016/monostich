package cc.ai42.monostich;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Arrays;

record PoemForm(String title, String stich) {}

record PoemGroupForm(String title, String[] poems) {}

record SearchForm(String pattern) {}

record IdForm(String id) {}

class Util {
    static long now() {
        return Instant.now().getEpochSecond();
    }

    static String[] StrArrFromJSON(String blob) {
        try {
            return new ObjectMapper().readValue(blob, String[].class);
        } catch (IOException e) {
            throw new RuntimeException("StrListFromJSON(): " + e);
        }
    }

    static String StrArrToJSON(String[] strArr) {
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

    public SearchHistory(String[] history) {
        this.history = new ArrayDeque<>(Arrays.asList(history));
    }

    void clear() {
        history.clear();
    }

    void push(String e) {
        history.addLast(e);
        if (history.size() > maxSearchHistory) history.removeFirst();
    }

    String[] toArray() {
        return history.toArray(new String[0]);
    }
}