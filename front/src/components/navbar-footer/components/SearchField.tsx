import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { debounce } from "lodash";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Product from "../../../entity/Product";
import ShopEntity from "../../../entity/ShopEntity";
import { useNavigate } from "react-router-dom";



export const SearchField = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ products: Product[]; shops: ShopEntity[] } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [flatResults, setFlatResults] = useState<(Product | ShopEntity)[]>([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
 
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [topShops, setTopShops] = useState<ShopEntity[]>([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let headers = {};
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          headers = {
            Authorization: `Bearer ${token}`,
          };
        }

        const response = await axios.get(
          `http://localhost:8080/api/product/getTopProducts`,
          { headers }
        );

        const responseShop = await axios.get(
          `http://localhost:8080/api/shop/getTopShops`,
          { headers }
        );

        const data = response.data;
        const shopData = responseShop.data;
        setPopularProducts(data);
        setTopShops(shopData);
        console.log(shopData);
      } catch (err) {
        console.error("Fetch error:", err);
      } 
    };

    fetchProduct();
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const products = searchResults?.products || [];
    const shops = searchResults?.shops || [];
    setFlatResults([...products, ...shops]);
  }, [searchResults]);

  const handleSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setSearchResults(null);
        return;
      }

      try {
        let headers = {};
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          headers = { Authorization: `Bearer ${token}` };
        }

        const [productsRes, shopsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/product/getProducts/${encodeURIComponent(term)}`, { headers }),
          axios.get(`http://localhost:8080/api/shop/getShops/${encodeURIComponent(term)}`, { headers }),
        ]);

        setSearchResults({
          products: productsRes.data || [],
          shops: shopsRes.data || [],
        });
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults({ products: [], shops: [] });
      }
    }, 500),
    [isAuthenticated, getAccessTokenSilently]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
    if (!isDropdownOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev <= 0 ? flatResults.length - 1 : prev - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = flatResults[selectedIndex];
      console.log("Selected item:", selected);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-2 sm:px-4" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search products, shops, and more..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full py-2 px-10 bg-gray-900 text-gray-100 rounded-full
                   border border-gray-700 focus:border-purple-500 outline-none
                   transition-all duration-300 placeholder-gray-400
                   text-sm sm:text-base"
          aria-label="Search input field"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSearchResults(null);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                       hover:text-gray-200 transition-colors duration-200"
            aria-label="Clear search"
          >
            <FiX className="text-lg" />
          </button>
        )}

        {isDropdownOpen && (
          <div className="absolute w-full mt-2 bg-gray-900 rounded-lg shadow-2xl
                          border border-gray-800 overflow-hidden
                          animate-fadeIn z-50 max-h-[70vh] overflow-y-auto">
            {!searchResults ? (
              <div className="p-3">
                <div className="mb-4">
                  <h3 className="text-gray-200 text-sm font-semibold mb-2 px-2">Popular Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {popularProducts.map((product, index) => (
                      <div
                        key={product.id}
                        onClick={
                          () => {
                            navigate(`/products/${product.id}`);
                            setIsDropdownOpen(false);
                          }
                        }
                        className={`flex items-center p-2 ${selectedIndex === index ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                  rounded-lg transition-all duration-200 cursor-pointer`}
                      >
                        <img
                          src={product.imageUrl || "/Default.png"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/Default.png";
                          }}
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <h4 className="text-gray-200 font-medium text-sm truncate">{product.name}</h4>
                          <div className="flex items-center">
                            <AiFillStar className="text-yellow-400 text-xs" />
                            <span className="text-gray-400 text-xs ml-1">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-200 text-sm font-semibold mb-2 px-2">Top Rated Shops</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {topShops.map((shop, index) => (
                      <div
                        onClick={
                          () => {
                            navigate(`/shops/${shop.name}`);
                            setIsDropdownOpen(false);
                          }
                        }
                        key={shop.id}
                        className={`flex items-center p-2 ${selectedIndex === index + popularProducts.length ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                  rounded-lg transition-all duration-200 cursor-pointer`}
                      >
                        <img
                          src={shop.imageUrl || "/Shop.png"}
                          alt={shop.name}
                          className="w-10 h-10 object-cover rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/Default.png";
                          }}
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <h4 className="text-gray-200 font-medium text-sm truncate">{shop.name}</h4>
                          <div className="flex items-center">
                            <AiFillStar className="text-yellow-400 text-xs" />
                            <span className="text-gray-400 text-xs ml-1">
                              {shop.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3">
                {searchResults.products.length === 0 && searchResults.shops.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    No results found for "{searchTerm}"
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.products.length > 0 && (
                      <div>
                        <h3 className="text-gray-200 text-sm font-semibold mb-2 px-2">Products</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.products.map((product, index) => (
                            <div
                              onClick={
                                () => {
                                  navigate(`/products/${product.id}`);
                                  setIsDropdownOpen(false);
                                }
                              }
                              key={product.id}
                              className={`flex items-center p-2 ${selectedIndex === index ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                        rounded-lg transition-all duration-200 cursor-pointer`}
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/Default.png";
                                }}
                              />
                              <div className="ml-3 flex-1 min-w-0">
                                <h4 className="text-gray-200 font-medium text-sm truncate">{product.name}</h4>
                                <div className="flex items-center">
                                  <AiFillStar className="text-yellow-400 text-xs" />
                                  <span className="text-gray-400 text-xs ml-1">{product.rating}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.shops.length > 0 && (
                      <div>
                        <h3 className="text-gray-200 text-sm font-semibold mb-2 px-2">Shops</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.shops.map((shop, index) => (
                            <div
                              onClick={
                                () => {
                                  navigate(`/shops/${shop.name}`);
                                  setIsDropdownOpen(false);
                                }
                              }
                              key={shop.id}
                              className={`flex items-center p-2 ${selectedIndex === index + searchResults.products.length ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                        rounded-lg transition-all duration-200 cursor-pointer`}
                            >
                              <img
                                src={shop.imageUrl}
                                alt={shop.name}
                                className="w-10 h-10 object-cover rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/Default.png";
                                }}
                              />
                              <div className="ml-3 flex-1 min-w-0">
                                <h4 className="text-gray-200 font-medium text-sm truncate">{shop.name}</h4>
                                <div className="flex items-center">
                                  <AiFillStar className="text-yellow-400 text-xs" />
                                  <span className="text-gray-400 text-xs ml-1">{shop.rating}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

