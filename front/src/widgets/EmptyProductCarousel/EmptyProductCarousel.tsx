import {FiShoppingCart} from "react-icons/fi";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";

// Updated: Changed component name and removed full-page styling
export const EmptyProductCarousel = () => {
    return (
        // Updated: Changed container div classes to make it a section instead of full page
        <div className="w-full py-1 px-4 flex items-center justify-center ">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="text-center max-w-lg"
            >
                <motion.div
                    animate={{scale: [1, 1.02, 1]}}
                    transition={{repeat: Infinity, duration: 2}}
                    className="mb-6"
                >
                    <FiShoppingCart className="w-20 h-20 mx-auto text-purple-500 opacity-80"/>
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold tw-text-white mb-3">
                    No Products Available
                </h2>

                <p className="text-md md:text-lg text-gray-400 mb-6">
                    Explore our upcoming collections
                </p>

                <Link to="/myshop">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold
                     transition-colors duration-300 hover:bg-purple-700 focus:outline-none
                     focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
                        aria-label="Browse Categories"
                    >
                        Be the First to Sell a Product!
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

