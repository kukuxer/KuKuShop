import React, {useState} from "react";
import {FaStar} from "react-icons/fa";
import {Shop} from "../../../../entities";
import {ShopDescription} from "../../ui/ShopDescription.tsx";

interface MyShopBannerProps {
    shop?: Shop;
}

export const MyPublicShopBanner: React.FC<MyShopBannerProps> = ({shop}) => {
    const [initialTitle] = useState(shop?.name || "Elegant Fashion Boutique");
    const [initialDescription] = useState(
        shop?.description?.toString().trim() ||
        "Discover our curated collection of luxury fashion pieces, where style meets sophistication. Experience premium quality and trendsetting designs."
    );
    const [initialImageUrl] = useState(shop?.imageUrl || "");

    const [title] = useState(initialTitle);
    const [description] = useState(initialDescription);
    const [imageUrl] = useState(initialImageUrl);
    const [rating] = useState(shop?.rating || 4.8);
    const [reviewCount] = useState(256);

    const Stars = () => (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    className={`${
                        index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                    } w-5 h-5`}
                />
            ))}
        </div>
    );

    return (
        <div className="relative h-96 overflow-hidden rounded-xl shadow-lg">
            <img
                src={imageUrl || "/placeholder.jpg"}
                alt="PublicShopPage Banner"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-black/40">
                <div className="w-full max-w-3xl text-center space-y-6">
                    <div className="relative inline-block">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                        <Stars/>
                        <span className="text-white">
              {rating} ({reviewCount} reviews)
            </span>
                    </div>

                    <ShopDescription description={description}/>
                </div>
            </div>
        </div>
    );
};

