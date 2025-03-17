import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Shop from "../../../entity/Shop";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isFavorite: boolean;
}

const MyShopPage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get("http://localhost:8080/api/shop/myShop", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShop(response.data);
      } catch (err) {
        setError("Error fetching shop details");
        console.error("Error fetching shop details:", err);
      }
    };

    fetchShopData();
  }, [getAccessTokenSilently]);


  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get("http://localhost:8080/api/product/getMyProducts", {
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
  }, [getAccessTokenSilently]);
  

  const toggleFavorite = (productId: number): void => {
    setProducts(products.map((product) =>
      product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product
    ));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={`w-4 h-4 ${index < Math.floor(rating) ? "text-purple-500" : "text-gray-600"}`}
        />
      ))}
    </div>
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="relative">
        <img src={product.image} alt={product.name} className="object-cover w-full h-48" loading="lazy" />
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 bg-opacity-70"
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
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
          <div className="relative ml-4">
            <FaShoppingCart className="text-white text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyShopPage;