package cc.ai42.cmdcopy;

import java.security.SecureRandom;
import java.time.Instant;

public class RandomID {

    long id;

    public RandomID() {
        long max = 100_000_000;
        long n = new SecureRandom().nextLong(max);
        long unixTime =  Instant.now().getEpochSecond();
        id = unixTime * max + n;
    }

    @Override
    public String toString() {
        return Long.toString(id, 36);
    }
}
