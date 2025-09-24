package com.group3.be.movie.theater.util.error;

public class TimeIsBookedException extends RuntimeException {
    public TimeIsBookedException(String message) {
        super(message);
    }
}
