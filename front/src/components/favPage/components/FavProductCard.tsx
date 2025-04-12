import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Product from "../../../entity/Product";
import { useAuth0 } from "@auth0/auth0-react";
import RatingStars from "../../shopPage/components/RatingStars";
import AddToBasketButton from "../../buttons/AddToCartBtn";

interface ProductCardProps {
  product: Product;
  onToggleFavorite: (productId: string, isCurrentlyFavorite: boolean) => void;
}

const FavProductCard: React.FC<ProductCardProps> = ({ product, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleToggleFavorite = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetch(`http://localhost:8080/api/public/favorites/${product.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onToggleFavorite(product.id, product.favorite ?? false);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 ${
        isHovered ? "scale-105 shadow-purple-500/50 shadow-lg" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={product.imageUrl || "/Default.png"}
          alt={product.name}
          className="object-cover w-full h-48"
          loading="lazy"
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 bg-opacity-70 hover:bg-opacity-100 transition-all duration-300"
        >
          <FaTrash className={`w-5 h-5 ${product.favorite ? "text-red-500" : "text-gray-400"}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-400 font-bold">${product.price}</span>
          <RatingStars rating={product.rating || 0} />
        </div>
        <p className="text-gray-400 text-sm mb-4">{product.reviews || 0} reviews</p>

        <AddToBasketButton productId={product.id} isProductAlreadyInCart={product.inBasket} />
      </div>
    </div>
  );
};

export default FavProductCard;
