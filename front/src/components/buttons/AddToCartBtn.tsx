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
  const [clicked, setClicked] = useState(false); // Track if the button has been clicked


  const handleClick = async () => {
    setClicked(true); // Set clicked to true when the button is clicked
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

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading || isProductAlreadyInCart}
        className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ${
          isProductAlreadyInCart || clicked ? "bg-transparent text-purple-500 cursor-not-allowed"  : "bg-purple-600 hover:bg-purple-700 text-white"
      }`}
    >
        {isProductAlreadyInCart || clicked ? "This product in your cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default AddToBasketButton;