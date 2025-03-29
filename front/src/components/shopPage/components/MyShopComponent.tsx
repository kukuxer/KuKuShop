import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaSearch, FaHeart, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import ShopBanner from "./ShopBanner";
import { Link } from "react-router-dom";
import Product from "../../../entity/Product";
import ProductCard from "./ProductCard";

const MyShopComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [shopImage, setShopImage] = useState("/default-shop-image.jpg");
  const [products, setProducts] = useState<Product[]>([]);
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
        const token = await getAccessTokenSilently();
        const response = await axios.get("http://localhost:8080/api/product/getMyProducts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        ? { ...product, favorite: !product.favorite }
        : product
    ));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const AddMoreCard = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-300">
      <Link to={"/productForm"}>
      <div className="text-center p-8">
        <FaPlus className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <p className="text-white font-semibold">Add More Items</p>
      </div>
      </Link>
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
              <ProductCard key={product.id} product={product} onToggleFavorite={toggleFavorite} />
            ))}
            <AddMoreCard />
          </div>
        )}
      </main>
    </div>
  );
};

export default MyShopComponent;