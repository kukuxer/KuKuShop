import React, { useState, useEffect } from "react";
import { FaHeart, FaSearch } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import FavProductCard from "./components/FavProductCard";
import Product from "../../entity/Product";
import axios from "axios";

const LikedProducts: React.FC = () => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "date">(
    "date"
  );
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = await getAccessTokenSilently();
        const { data } = await axios.get(
          "http://localhost:8080/api/public/favorites/products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLikedProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch favorite products", err);
      }
    };

    fetchFavorites();
  }, [getAccessTokenSilently, refreshTrigger]);

  const handleSort = (type: "price-asc" | "price-desc" | "date") => {
    setSortBy(type);
    const sortedProducts = [...likedProducts];
    switch (type) {
      case "price-asc":
        sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "date":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
        break;
    }
    setLikedProducts(sortedProducts);
  };

  const handleToggleFavorite = (
    productId: string,
    isCurrentlyFavorite: boolean
  ) => {
    if (isCurrentlyFavorite) {
      setLikedProducts((prev) =>
        prev.filter((p) => String(p.id) !== productId)
      );
      setRefreshTrigger((prev) => prev + 1);
    } else {
      fetchFavorites();
    }
  };

  const filteredProducts = likedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
            Liked Products
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) =>
                handleSort(
                  e.target.value as "price-asc" | "price-desc" | "date"
                )
              }
              className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">Sort by Date</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <FaHeart className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300">
              No liked products found. Start adding some!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <FavProductCard
                key={product.id}
                product={product}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedProducts;
function fetchFavorites() {
  throw new Error("Function not implemented.");
}
