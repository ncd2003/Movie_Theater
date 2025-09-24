package com.group3.be.movie.theater.util.error;

public class RoomInUseException extends RuntimeException {
    public RoomInUseException(String message) {
        super(message);
    }
}
