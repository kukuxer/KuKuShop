import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { debounce } from "lodash";

const SearchField = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [flatResults, setFlatResults] = useState([]);

  const popularProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      description: "High-quality sound with noise cancellation",
      price: "$299.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      description: "Track your health with precision",
      price: "$199.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
      id: 3,
      name: "Ergonomic Gaming Chair",
      description: "Ultimate comfort for long gaming sessions",
      price: "$399.99",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
    }
  ];

  const topShops = [
    {
      id: 1,
      name: "TechHub Plus",
      rating: 4.8,
      reviews: 1234,
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603"
    },
    {
      id: 2,
      name: "Gaming Galaxy",
      rating: 4.7,
      reviews: 982,
      logo: "https://images.unsplash.com/photo-1516321497487-e288fb19713f"
    },
    {
      id: 3,
      name: "Electronics Empire",
      rating: 4.6,
      reviews: 756,
      logo: "https://images.unsplash.com/photo-1478860409698-8707f313ee8b"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const products = searchResults?.products || popularProducts;
    const shops = searchResults?.shops || topShops;
    setFlatResults([...products, ...shops]);
  }, [searchResults]);

  const handleSearch = debounce((term) => {
    if (term) {
      const filteredProducts = popularProducts.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      const filteredShops = topShops.filter(shop =>
        shop.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults({ products: filteredProducts, shops: filteredShops });
    } else {
      setSearchResults(null);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleKeyDown = (e) => {
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
                        className={`flex items-center p-2 ${selectedIndex === index ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                  rounded-lg transition-all duration-200 cursor-pointer`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1560472355-536de3962603";
                          }}
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <h4 className="text-gray-200 font-medium text-sm truncate">{product.name}</h4>
                          <p className="text-gray-400 text-xs truncate">{product.price}</p>
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
                        key={shop.id}
                        className={`flex items-center p-2 ${selectedIndex === index + popularProducts.length ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                  rounded-lg transition-all duration-200 cursor-pointer`}
                      >
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          className="w-10 h-10 object-cover rounded-full"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1560472355-536de3962603";
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
                              key={product.id}
                              className={`flex items-center p-2 ${selectedIndex === index ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                        rounded-lg transition-all duration-200 cursor-pointer`}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1560472355-536de3962603";
                                }}
                              />
                              <div className="ml-3 flex-1 min-w-0">
                                <h4 className="text-gray-200 font-medium text-sm truncate">{product.name}</h4>
                                <p className="text-gray-400 text-xs truncate">{product.price}</p>
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
                              key={shop.id}
                              className={`flex items-center p-2 ${selectedIndex === index + searchResults.products.length ? 'bg-purple-900/30' : 'hover:bg-gray-800'}
                                        rounded-lg transition-all duration-200 cursor-pointer`}
                            >
                              <img
                                src={shop.logo}
                                alt={shop.name}
                                className="w-10 h-10 object-cover rounded-full"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1560472355-536de3962603";
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

export default SearchField;