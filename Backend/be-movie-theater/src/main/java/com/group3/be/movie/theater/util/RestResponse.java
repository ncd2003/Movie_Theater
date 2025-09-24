package com.group3.be.movie.theater.util;

import lombok.*;

@Getter
@Setter
public class RestResponse<T> {
    private int statusCode;
    private String error;
    private Object message;
    private T data;
}
