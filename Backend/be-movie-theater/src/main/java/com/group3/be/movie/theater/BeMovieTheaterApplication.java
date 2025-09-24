package com.group3.be.movie.theater;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = "com.group3.be.movie.theater")
public class BeMovieTheaterApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeMovieTheaterApplication.class, args);
	}

}
