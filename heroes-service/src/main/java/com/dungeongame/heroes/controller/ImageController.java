package com.dungeongame.heroes.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

//http://localhost:8081/images/<type>/<nom_du_fichier>

@RestController
@RequestMapping("/images")
public class ImageController {

    @Value("${app.images.head-dir}")
    private String headDir;

    @Value("${app.images.body-dir}")
    private String bodyDir;

    @Value("${app.images.hero-dir}")
    private String heroDir;

    @GetMapping("/{type}/{fileName}")
    public ResponseEntity<Resource> getImage(
            @PathVariable String type,
            @PathVariable String fileName) {

        String uploadDir;
        switch (type) {
            case "head":
                uploadDir = headDir;
                break;
            case "body":
                uploadDir = bodyDir;
                break;
            case "hero":
                uploadDir = heroDir;
                break;
            default:
                return ResponseEntity.badRequest().body(null);
        }

        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType
                                .parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                        .body(resource);

            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
