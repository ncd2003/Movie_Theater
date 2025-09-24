package com.group3.be.movie.theater.util;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BaseService {

    @Autowired
    protected ModelMapper modelMapper;

    // convert type1 --> type2
    public <TYPE1, TYPE2> TYPE2 convertObjectToObject(final TYPE1 type1, final Class<TYPE2> type2Class) {
        return modelMapper.map(type1, type2Class);
    }

}
