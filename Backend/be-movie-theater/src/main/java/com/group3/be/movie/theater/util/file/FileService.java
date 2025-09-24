package com.group3.be.movie.theater.util.file;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;

@Service
@AllArgsConstructor
public class FileService {

    public void CreateDirectory(String directory) {
        Path path = Paths.get(directory); // No need to use URI
        File tmpDir = new File(path.toString());

        if (!tmpDir.exists()) { // Check if directory does not exist
            try {
                Files.createDirectories(tmpDir.toPath()); // Use createDirectories instead of createDirectory
                System.out.println("Directory created: " + tmpDir.getAbsolutePath());
            } catch (IOException e) {
                throw new RuntimeException("Failed to create directory: " + tmpDir.getAbsolutePath(), e);
            }
        } else {
            System.out.println("Directory already exists: " + tmpDir.getAbsolutePath());
        }
    }

    public String saveFile(String directory, MultipartFile file) throws IOException {
        CreateDirectory(directory); // Ensure the folder exists

        // Generate new filename with timestamp
        String originalFilename = file.getOriginalFilename();
        String timestamp = String.valueOf(Instant.now().toEpochMilli()); // Get current time in milliseconds
        String newFilename = timestamp + "_" + originalFilename;

        Path filePath = Paths.get(directory, newFilename);

        // Save the file to disk
        Files.write(filePath, file.getBytes());


        return newFilename; // Return the new filename
    }

    public boolean deleteFile(String absoluteFilePath) {
        File file = new File(absoluteFilePath);
        if (file.exists()) {
            return file.delete();
        }
        return false;
    }


}
