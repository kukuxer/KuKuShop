package kukuxer.KuKushop.config;

import jakarta.transaction.Transactional;
import kukuxer.KuKushop.entity.*;
import kukuxer.KuKushop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.*;

@RequiredArgsConstructor
@Configuration
public class DataInitializer implements CommandLineRunner {

    private final ProfileRepository profileRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;

    private static final String DEFAULT_SHOP_IMAGE =
            "https://kukushopbucket.s3.eu-north-1.amazonaws.com/uploads/6bbb4d0b-127c-4728-8711-6e0402b39afd_Screenshot 2024-02-10 220740.png";
    private static final String DEFAULT_PRODUCT_IMAGE =
            "https://kukushopbucket.s3.eu-north-1.amazonaws.com/uploads/729ce0be-5e74-448d-9e95-0be0a6135fde_yourPhoto.jpg";

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        if (profileRepository.count() > 0) return;

        // ---- Categories ----
        List<Category> categories = categoryRepository.saveAll(List.of(
                new Category(null, "Jewelry"),
                new Category(null, "Clothing"),
                new Category(null, "Electronics"),
                new Category(null, "Accessories"),
                new Category(null, "Home Goods"),
                new Category(null, "Sports & Outdoors")
        ));

        Random random = new Random();

        // ---- Profiles / Shops / Products ----
        for (int i = 1; i <= 5; i++) {

            // ---- Create profile ----
            Profile profile = new Profile();
            profile.setAuthId("auth" + i);
            profile.setEmail("user" + i + "@example.com");
            profile.setName("User " + i);
            profile.setNickname("user" + i);
            profile.setImageUrl("https://lh3.googleusercontent.com/a/ACg8ocKrm9XEiyo8W-YFU_yV4KwupvkT0hkqUA6q-zrUBAAE5prjK5E=s96-c");
            profile.setRole("USER");
            profileRepository.save(profile);

            // ---- Shop ----
            Shop shop = new Shop();
            shop.setName("Shop " + i);
            shop.setOwnerName("User " + i);
            shop.setUserAuthId(profile.getAuthId());
            shop.setImageUrl(DEFAULT_SHOP_IMAGE);
            shop.setDescription("This is shop number " + i);
            shopRepository.save(shop);

            // ---- Products ----
            for (int j = 1; j <= 5; j++) {

                Product product = new Product();
                product.setShopId(shop.getId());
                product.setName("Product " + j + " of Shop " + i);
                product.setDescription("Description for product " + j + " from shop " + i);
                product.setPrice("19." + j + "9");
                product.setQuantity(10 + j);
                product.setImageUrl(DEFAULT_PRODUCT_IMAGE);

                product.setCategories(Set.of(
                        categories.get(random.nextInt(categories.size()))
                ));

                // ---- Additional pictures ----
                product.setAdditionalPictures(
                        List.of(
                                "https://kukushopbucket.s3.eu-north-1.amazonaws.com/uploads/caf6d10b-35bb-478c-aafe-19b29da5046a_Screenshot 2024-02-12 233844.png",
                                "https://kukushopbucket.s3.eu-north-1.amazonaws.com/uploads/34f3aa35-5c99-448e-bd5b-4ffd987a3e66_Screenshot 2024-04-30 202805.png",
                                "https://kukushopbucket.s3.eu-north-1.amazonaws.com/uploads/ba281c6b-e66f-49ff-af0f-df8f9a23ddb6_avengers.jpg"
                        )
                );

                productRepository.save(product);
                // ---- Comments before saving product ----
                List<Comment> createdComments = new ArrayList<>();
                double totalRating = 0;

                for (int c = 1; c <= 2; c++) {
                    Comment comment = new Comment();
                    comment.setProductId(product.getId());
                    comment.setUserId(profile.getId());
                    comment.setComment("This is comment " + c + " for product " + j);
                    double rating = 3.0 + random.nextInt(3);
                    comment.setRating(rating);

                    totalRating += rating;
                    commentRepository.save(comment);
                    createdComments.add(comment);
                }

                product.setComments(createdComments);
                product.setRating(totalRating / createdComments.size());

                // ---- Save ONCE ----

            }
        }

        System.out.println("✔ Mock data with pictures + comments created successfully.");
    }
}
