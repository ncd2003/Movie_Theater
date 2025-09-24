package com.group3.be.movie.theater.domain.type;

import com.group3.be.movie.theater.domain.movie.Movie;
import com.group3.be.movie.theater.domain.type.type_dto.ResTypeDTO;
import com.group3.be.movie.theater.util.BaseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TypeService {
    private final TypeRepository repo;
    private final BaseService baseService;

    public Type createType(Type type){
        return repo.save(type);
    }

    public ResTypeDTO getTypeById(Long id) {
        return repo.findById(id)
                .map(type -> baseService.convertObjectToObject(type, ResTypeDTO.class))
                .orElse(null);
    }

    public List<ResTypeDTO> getAllType() {
        return repo.findAll().stream()
                .map(type -> baseService.convertObjectToObject(type, ResTypeDTO.class))
                .collect(Collectors.toList());
    }

    public Type deleteTypeById(Long id) {
        Type type = repo.findById(id).orElse(null);
        if (type != null) {
            repo.deleteById(id);
        }
        return type;
    }

    public List<ResTypeDTO> getTypesByMovieId(Long movieId) {
        return repo.findByMovieId(movieId).stream()
                .map(type -> baseService.convertObjectToObject(type, ResTypeDTO.class))
                .collect(Collectors.toList());
    }
    public void createDefaultMovieTypes() {
        List<String> defaultTypes = List.of(
                "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama",
                "Fantasy", "Family", "Historical", "Horror", "Musical", "Mystery", "Romance", "Sci-Fi", "Sports",
                "Superhero", "Thriller", "War", "Western", "Noir", "Psychological Thriller", "Experimental",
                "Disaster", "Martial Arts", "Cyberpunk", "Steampunk", "Survival", "Dark Comedy",
                "Anthology", "Found Footage", "Epic", "Political", "Religious",
                "Spy", "Heist", "Vampire", "Zombie", "Time Travel", "Gothic", "Post-Apocalyptic",
                "Fantasy Adventure", "Supernatural Thriller", "Dystopian", "Psychodrama", "Neo-Noir",
                "Teen", "Folk Horror"
        );

        Set<String> existingTypes = repo.findAll().stream()
                .map(Type::getTypeName)
                .collect(Collectors.toSet());

        List<Type> typesToSave = defaultTypes.stream()
                .filter(typeName -> !existingTypes.contains(typeName))
                .map(typeName -> {
                    Type type = new Type();
                    type.setTypeName(typeName);
                    return type;
                })
                .collect(Collectors.toList());

        if (!typesToSave.isEmpty()) {
            repo.saveAll(typesToSave);
        }
    }
}
