import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaSearch, FaHeart } from "react-icons/fa";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const MyShopPage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [products, setProducts] = useState<any[]>([]); // Store fetched products
  const [loading, setLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchShopProducts = async () => {
  //     try {
  //       const token = await getAccessTokenSilently();
  //       const response = await axios.get("http://localhost:8080/api/shop/products", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setProducts(response.data); // Assuming the response has a list of products
  //     } catch (err) {
  //       setError("Error fetching products");
  //       console.error("Error fetching products:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchShopProducts();
  // }, [getAccessTokenSilently]);

  const toggleFavorite = (productId: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product
      )
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RatingStars = ({ rating }: { rating: number }) => {
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

  const ProductCard = ({ product }: { product: any }) => {
    const [isHovered, setIsHovered] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">My Shop</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyShopPage;
