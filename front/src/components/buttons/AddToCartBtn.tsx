import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom"; 

interface AddToBasketButtonProps {
  productId: string;
  isProductAlreadyInCart: boolean;
  isOwner?: boolean;
}

const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({
  productId,
  isProductAlreadyInCart,
  isOwner = false,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate(); 

  const handleClick = async () => {
    setClicked(true);
    if (isProductAlreadyInCart) return;

    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `http://localhost:8080/api/public/basket/add/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = () => {
    navigate(`/editProduct/${productId}`);
  };

  return (
    <div className="space-y-3">
      {isOwner ? (
        <button
          onClick={handleEditProduct}
          className="w-full font-semibold py-2 px-4 rounded-lg border-2 border-purple-700 text-purple-400 bg-black hover:bg-purple-700 hover:text-white transition-colors duration-300 shadow-md hover:shadow-purple-700/50"
        >
          Edit Product
        </button>
      ) : (
        <button
          onClick={handleClick}
          disabled={loading || isProductAlreadyInCart}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ${
            isProductAlreadyInCart || clicked
              ? "bg-transparent text-purple-500 border-1 border-purple-500 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {isProductAlreadyInCart || clicked
            ? "This product is in your cart"
            : "Add to Cart"}
        </button>
      )}
    </div>
  );
};

export default AddToBasketButton;
