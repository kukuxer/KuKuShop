import React from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

interface ProductBasketCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    quantity: number;
  };
  updateQuantity?: (id: string, change: number) => void;
  removeItem?: (id: string) => void;
}

const ProductBasketCard: React.FC<ProductBasketCardProps> = ({ product, updateQuantity, removeItem }) => {
  if (!product) return null; 
  
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <img src={product.imageUrl || "/Default.png"} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-300">{product.name}</h3>
          <p className="text-gray-400">${parseFloat(product.price).toFixed(2)}</p>
          <div className="flex items-center space-x-4 mt-2">
            <button onClick={() => updateQuantity?.(product.id, -1)} className="p-1 rounded-full hover:bg-purple-700">
              <FiMinus className="text-purple-300" />
            </button>
            <span className="text-purple-300">{product.quantity}</span>
            <button onClick={() => updateQuantity?.(product.id, 1)} className="p-1 rounded-full hover:bg-purple-700">
              <FiPlus className="text-purple-300" />
            </button>
            <button onClick={() => removeItem?.(product.id)} className="p-1 rounded-full hover:bg-red-700 ml-4">
              <FiTrash2 className="text-red-400" />
            </button>
          </div>
        </div>
        <div className="text-xl font-bold text-purple-300">
          ${(parseFloat(product.price) * product.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductBasketCard;
