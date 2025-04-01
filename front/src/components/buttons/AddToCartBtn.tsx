import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface AddToBasketButtonProps {
  productId: string;
  isProductAlreadyInCart: boolean;
}

const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({ productId, isProductAlreadyInCart }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (isProductAlreadyInCart) return;

    setLoading(true);
    setMessage(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `http://localhost:8080/api/public/basket/add/${productId}`,
        {}, // Empty body if no data needs to be sent
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );
    

      setMessage(response.data);
    } catch (error) {
      setMessage("Failed to add product to basket.");
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading || isProductAlreadyInCart}
        className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ${
          isProductAlreadyInCart || loading ? "bg-transparent text-purple-500 cursor-not-allowed"  : "bg-purple-600 hover:bg-purple-700 text-white"
      }`}
    >
        {isProductAlreadyInCart ? "This product in your cart" : loading ? "Adding..." : "Add to Cart"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
    </div>
  );
};

export default AddToBasketButton;