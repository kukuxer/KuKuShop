import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaSearch, FaHeart, FaPlus } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isFavorite: boolean;
}

interface RatingStarsProps {
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

const DarkShop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Gaming Headset",
      price: 199.99,
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      isFavorite: false
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      price: 159.99,
      rating: 4.6,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      isFavorite: false
    },
    {
      id: 3,
      name: "Gaming Mouse",
      price: 89.99,
      rating: 4.9,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
      isFavorite: false
    },
    {
      id: 4,
      name: "4K Monitor",
      price: 499.99,
      rating: 4.7,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2",
      isFavorite: false
    },
    {
      id: 5,
      name: "Gaming Chair",
      price: 299.99,
      rating: 4.5,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1610395219791-21b0353e43c9",
      isFavorite: false
    },
    {
      id: 6,
      name: "RGB Mouse Pad",
      price: 29.99,
      rating: 4.4,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1588200908342-23b585c03e26",
      isFavorite: false
    }
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const toggleFavorite = (productId: number): void => {
    setProducts(products.map((product) =>
      product.id === productId
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`w-4 h-4 ${index < Math.floor(rating) ? "text-purple-500" : "text-gray-600"}`}
          />
        ))}
      </div>
    );
  };

  const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
      <div
        className={`bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 ${isHovered ? "scale-105 shadow-purple-500/50 shadow-lg" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-48"
            loading="lazy"
          />
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 bg-opacity-70 hover:bg-opacity-100 transition-all duration-300"
          >
            <FaHeart className={`w-5 h-5 ${product.isFavorite ? "text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-400 font-bold">${product.price}</span>
            <RatingStars rating={product.rating} />
          </div>
          <p className="text-gray-400 text-sm mb-4">{product.reviews} reviews</p>
          <button
            onClick={() => setCartCount(prev => prev + 1)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  const AddMoreCard: React.FC = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-300">
      <div className="text-center p-8">
        <FaPlus className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <p className="text-white font-semibold">Add More Items</p>
      </div>
    </div>
  );

  const EmptyState: React.FC = () => (
    <div className="text-center py-16">
      <FaShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-4">You don't have any items yet</h3>
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
        Create New Item
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
          alt="Gaming Setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Tech Haven</h1>
          <div className="flex items-center space-x-2">
            <RatingStars rating={4.8} />
            <span className="text-white">(1,267 reviews)</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-800 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative ml-4">
            <FaShoppingCart className="text-white text-2xl cursor-pointer hover:text-purple-400 transition-colors duration-300" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white text-center">Featured Products</h2>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            <AddMoreCard />
          </div>
        )}
      </main>
    </div>
  );
};

export default DarkShop;
