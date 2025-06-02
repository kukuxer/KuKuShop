import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Product} from "../model/types.ts";
import {RatingStars} from "../../../pages/shop/ui/RatingStars.tsx";
import {LikeBtn, AddToBasketButton} from "../../../shared/ui/buttons";

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 ${
                isHovered
                    ? "scale-105 shadow-lg shadow-[#6A0DAD] ring-4 ring-[#6A0DAD]/30"
                    : "shadow-[#404040] ring-0"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="aspect-w-16 aspect-h-9 justify-end items-start">
                <Link to={`/products/${product.id}`} className="no-underline">
                    <img
                        src={product.imageUrl || "/Default.png"}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/Default.png";
                        }}
                        alt={product.name}
                        className="object-cover w-full h-48"
                        loading="lazy"
                    />
                </Link>
                <div className="absolute top-2 right-2 z-10">
                    <LikeBtn isFavorite={product.favorite} productId={product.id}/>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-bold">${product.price}</span>
                    <RatingStars rating={product.rating || 0}/>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                    {product.reviews || 0} reviews
                </p>

                <AddToBasketButton
                    product={product}
                    isRedirectingToEdit={true}

                />
            </div>
        </div>
    );
};

