package com.group3.be.movie.theater.domain.type;


import com.group3.be.movie.theater.domain.type.type_dto.ResTypeDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/type")
public class TypeController {
    private final TypeService typeService;

    @PostMapping
    public ResponseEntity<Type> createType(@RequestBody Type type) {
        Type savedType = typeService.createType(type);
        return new ResponseEntity<>(savedType, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResTypeDTO>> getAllTypes() {
        List<ResTypeDTO> types = typeService.getAllType();
        return new ResponseEntity<>(types, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<ResTypeDTO> getTypeById(@PathVariable Long id) {
        ResTypeDTO type = typeService.getTypeById(id);
        return new ResponseEntity<>(type, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteTypeById(@PathVariable Long id) {
        typeService.deleteTypeById(id);
        return ResponseEntity.ok("Movie marked as inactive successfully.");
    }

    @GetMapping("/client/movie/{movieId}")
    public ResponseEntity<List<ResTypeDTO>> getTypesByMovieId(@PathVariable Long movieId) {
        List<ResTypeDTO> types = typeService.getTypesByMovieId(movieId);
        return new ResponseEntity<>(types, HttpStatus.OK);
    }



}
