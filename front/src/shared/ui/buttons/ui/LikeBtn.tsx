import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import {toggleFavoriteProduct} from "../../../../entities/product/api/FavProducts.ts";

interface LikeBtnProps {
  isFavorite: boolean;
  productId: string;
}

export const LikeBtn: React.FC<LikeBtnProps> = ({ isFavorite, productId }) => {
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggleFavorite = async () => {
    const originalState = localIsFavorite;
    try {
      const token = await getAccessTokenSilently();

      setLocalIsFavorite(!originalState);

      await toggleFavoriteProduct(productId, token);

    } catch (error) {
      console.error("Failed to toggle favorite", error);
      setLocalIsFavorite(originalState);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className="p-2 rounded-full bg-gray-800 bg-opacity-70 hover:bg-opacity-100 transition-all duration-300"
    >
      <FaHeart
        className={`w-5 h-5 ${
          localIsFavorite ? "text-red-500" : "text-gray-400"
        } transition-colors duration-300`}
      />
    </button>
  );
};
