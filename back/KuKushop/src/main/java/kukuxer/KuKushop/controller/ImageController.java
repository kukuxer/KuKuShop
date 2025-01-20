package kukuxer.KuKushop.controller;

import kukuxer.KuKushop.entity.Image;
import kukuxer.KuKushop.repository.ImageRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@AllArgsConstructor
@RequestMapping("/api/images")
public class ImageController {
    private final ImageRepository imageRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file) {
        System.out.println("File name: " + file.getOriginalFilename());
        System.out.println("File size: " + file.getSize());
        System.out.println("File type: " + file.getContentType());

        try {
            Image image = new Image();
            image.setName(file.getOriginalFilename());
            image.setData(file.getBytes());
            image.setType(file.getContentType());
            System.out.println("Saving image: " + image);
            imageRepository.save(image);


            return ResponseEntity.ok("Image uploaded successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        return imageRepository.findById(id)
                .map(image -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, image.getType())
                        .body(image.getData()))
                .orElse(ResponseEntity.notFound().build());
    }
}
