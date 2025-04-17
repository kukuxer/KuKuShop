import { FaStar, FaShoppingBag, FaStore, FaEnvelope, FaCheck, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import ShopEntity from "../../../entity/ShopEntity";

interface ShopCardProps{
  shop: ShopEntity;
}

const ShopCard: React.FC<ShopCardProps>= ({shop}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const shopData = {
    shopName: shop.name,
    rating: 4.8,
    sales: 1234,
    isVerified: true,
    description: "Unique, handcrafted jewelry pieces made with love and precision",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3"
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${index < Math.floor(rating) ? "text-purple-400" : "text-gray-600"} w-4 h-4`}
          />
        ))}
        <span className="ml-2 text-gray-300">{rating}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative">
              <img
                src={shopData.avatarUrl}
                alt={shopData.shopName}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3";
                }}
              />
              <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                <FaStore className="w-3 h-3 text-white" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">{shopData.shopName}</h2>
              <div className="flex items-center mt-1">
                {shopData.isVerified ? (
                  <span className="flex items-center text-green-400 text-sm">
                    <FaCheck className="w-3 h-3 mr-1" /> Trusted
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-400 text-sm">
                    <FaClock className="w-3 h-3 mr-1" /> Pending Verification
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-5 flex items-center">
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center">
                <StarRating rating={shopData.rating} />
                <span className="text-gray-400 text-sm">{shopData.sales} sales</span>
              </div>
              <p className="text-gray-300 text-sm">{shopData.description}</p>
            </div>
          </div>

          <div className="col-span-4 flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg
                font-medium flex items-center justify-center space-x-2 transition-all duration-300
                hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              aria-label="Shop All Items"
            >
              <FaShoppingBag className="w-5 h-5" />
              <span>Shop</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-lg
                font-medium flex items-center justify-center space-x-2 transition-all duration-300
                hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              aria-label="Contact Shop"
            >
              <FaEnvelope className="w-5 h-5" />
              <span>Contact</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopCard;