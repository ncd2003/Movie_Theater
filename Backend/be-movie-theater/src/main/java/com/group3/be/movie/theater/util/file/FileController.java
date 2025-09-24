package com.group3.be.movie.theater.util.file;


import com.group3.be.movie.theater.util.annotation.APIMessage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Paths;

@RestController
@RequestMapping("api/v1/file")
public class FileController {


    private final String baseURI;

    private final FileService fileService;

    public FileController(@Value("${be-movie-theater.upload-file.base-uri}") String baseURI, FileService fileService) {
        this.baseURI = new File(baseURI).getAbsolutePath();
        this.fileService = fileService;
    }

    @APIMessage("Upload a file")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folder)
            throws IOException, URISyntaxException
    {


        String folderPath = Paths.get(baseURI, folder).toString();

        fileService.CreateDirectory(folderPath);
        // Save the file and get the new filename
        String savedFilename = fileService.saveFile(folderPath, file);
        String newPath =  "http://localhost:8080/storage/"+folder +"/"+savedFilename;

        return ResponseEntity.ok(newPath);
    }

    @APIMessage("Delete a file by URL")
    @PostMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam("fileUrl") String fileUrl) {
        // Convert file URL to relative path by stripping the public URL part
        String relativePath = fileUrl.replace("http://localhost:8080/storage/", "");

        // Convert relative path to absolute system path (handled in controller)
        String absoluteFilePath = Paths.get(baseURI, relativePath).toString();

        // Pass only the absolute file path to service
        boolean deleted = fileService.deleteFile(absoluteFilePath);

        if (deleted) {
            return ResponseEntity.ok("File deleted successfully: " + fileUrl);
        } else {
            return ResponseEntity.ok("File not found or could not be deleted: " + fileUrl);
        }
    }

}
