import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaSearch, FaHeart, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import ShopBanner from "./ShopBanner";
import { Link } from "react-router-dom";

const DarkShop = () => {
  const [error, setError] = useState(null);
  const [shopImage, setShopImage] = useState("/default-shop-image.jpg");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
      const fetchShopImage = async () => {
        try {
          const token = await getAccessTokenSilently();
      
          const response = await fetch("http://localhost:8080/api/shop/myShopImage", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.ok) {
            const imageUrl = await response.text(); 
            setShopImage(imageUrl); 
            console.log("Shop image URL:", imageUrl);
          } else {
            setShopImage("/default-shop-image.jpg"); 
          }
        } catch (error) {
          console.error("Error fetching shop image:", error);
        }
      };
      fetchShopImage();
    }, [getAccessTokenSilently]);

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/product/getMyProducts");
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
      } catch (err) {
        setError("Error fetching products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopProducts();
  }, []);

  const toggleFavorite = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RatingStars = ({ rating }) => {
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

  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 ${isHovered ? "scale-105 shadow-purple-500/50 shadow-lg" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={product.imageUrl || "/default-product-image.jpg"}
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
            <RatingStars rating={product.rating || 0} />
          </div>
          <p className="text-gray-400 text-sm mb-4">{product.reviews || 0} reviews</p>
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

  const AddMoreCard = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-300">
      <div className="text-center p-8">
        <FaPlus className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <p className="text-white font-semibold">Add More Items</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <FaShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-4">You don't have any items yet</h3>
      <Link to={"/productForm"}>
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
        Create New Item
      </button>
      </Link>
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
    <div className="min-h-screen bg-gray-900">
      <ShopBanner imageUrl={shopImage || "https://source.unsplash.com/1600x900/?shop"} />

     


      <nav className="bg-gray-900 p-4 sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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

      <main className="container mx-auto px-4 py-8 bg-gray-900">
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