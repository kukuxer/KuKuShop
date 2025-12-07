import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../model/types.ts";
import { AddToBasketButton, LikeBtn } from "../../../shared/ui/buttons";
import { RatingStars } from "../../../pages/shop/ui/RatingStars.tsx";

export const ProductCardForCatalog: React.FC<{ product: Product }> = ({ product }) => {
    const navigate = useNavigate();

    const [mainImage, setMainImage] = useState(
        product.imageUrl || "/Default.png"
    );

    const [showFullDesc, setShowFullDesc] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        navigate(`/products/${product.id}`);
    };

    const allImages = [
        product.imageUrl,
        ...(product.additionalPictures || [])
    ].filter(Boolean);

    return (
        <div
            onClick={handleClick}
            className="
                bg-[#0d0d0d]
                rounded-xl
                overflow-hidden
                border border-[#222]
                shadow-md
                cursor-pointer
                transition-all duration-300
                hover:shadow-purple-900/20
            "
        >

            {/* IMAGE AREA */}
            <div
                className="
                    relative w-full
                    h-48
                    hover:h-64
                    transition-all duration-300 ease-out
                "
            >
                <img
                    src={mainImage}
                    alt={product.name}
                    className="object-cover w-full h-full transition-all duration-300"
                    loading="lazy"
                />

                {/* Like Button */}
                <div className="absolute top-2 right-2 z-20">
                    <LikeBtn isFavorite={product.favorite} productId={product.id} />
                </div>
            </div>

            {/* THUMBNAILS */}
            {allImages.length > 1 && (
                <div className="flex gap-2 px-3 pt-2">
                    {allImages.map((pic, i) => (
                        <img
                            key={i}
                            src={pic}
                            alt="thumb"
                            onMouseEnter={() => setMainImage(pic)}
                            className="
                                w-10 h-10 rounded-md object-cover
                                border border-[#333]
                                hover:border-purple-500/40 hover:scale-105
                                transition-all duration-150
                            "
                        />
                    ))}
                </div>
            )}

            {/* CATEGORIES */}
            {product.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 mt-3">
                    {product.categories.slice(0, 5).map((cat, idx) => (
                        <span
                            key={idx}
                            className="
                                text-xs
                                px-2 py-1
                                rounded-lg
                                bg-[#111]
                                border border-[#333]
                                text-purple-300
                                hover:border-purple-500/50
                                transition-all duration-200
                            "
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            )}

            {/* CONTENT */}
            <div className="p-4 flex flex-col">

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-gray-100 truncate">
                    {product.name}
                </h3>

                {/* DESCRIPTION */}
                <p className={`text-sm text-gray-400 ${showFullDesc ? "" : "line-clamp-2"}`}>
                    {product.description}
                </p>

                {product.description.length > 80 && (
                    <button
                        className="text-xs text-purple-300 hover:text-purple-400 underline mt-1 self-start"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFullDesc(!showFullDesc);
                        }}
                    >
                        {showFullDesc ? "Show less" : "Show more"}
                    </button>
                )}

                {/* RATING + REVIEWS + PRICE */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-300">
                        <RatingStars rating={Math.round(product.rating)} />
                        <span className="text-xs text-gray-500 ml-1">
                            ({product.reviews ?? 0})
                        </span>
                    </div>

                    <span className="text-purple-300 font-bold">
                        €{(+product.price).toFixed(2)}
                    </span>
                </div>

                <div className="mt-4">
                    <AddToBasketButton product={product} />
                </div>

            </div>
        </div>
    );
};
