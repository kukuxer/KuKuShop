import React, {useState, useEffect, useRef, useCallback} from "react";
import {FiSearch, FiX, FiTrendingUp, FiShoppingBag} from "react-icons/fi";
import {AiFillStar} from "react-icons/ai";
import {debounce} from "lodash";
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {Product, Shop} from "../../../entities";
import axios from "axios";

export const SearchField = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<{ products: Product[]; shops: Shop[] } | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [flatResults, setFlatResults] = useState<(Product | Shop)[]>([]);
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();

    const [popularProducts, setPopularProducts] = useState<Product[]>([]);
    const [topShops, setTopShops] = useState<Shop[]>([]);
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
                    "http://localhost:8080/api/product/public/top/3",
                    {headers}
                );

                const responseShop = await axios.get(
                    `http://localhost:8080/api/shop/getTopShops`,
                    {headers}
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
                setIsFocused(false);
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
                    headers = {Authorization: `Bearer ${token}`};
                }

                const [productsRes, shopsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/product/getProducts/${encodeURIComponent(term)}`, {headers}),
                    axios.get(`http://localhost:8080/api/shop/getShops/${encodeURIComponent(term)}`, {headers}),
                ]);

                setSearchResults({
                    products: productsRes.data || [],
                    shops: shopsRes.data || [],
                });
            } catch (err) {
                console.error("Search error:", err);
                setSearchResults({products: [], shops: []});
            }
        }, 300),
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

    const handleFocus = () => {
        setIsFocused(true);
        setIsDropdownOpen(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setSearchResults(null);
        inputRef.current?.focus();
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto px-2 sm:px-4 min-w-0 flex-1" ref={dropdownRef}>
            {/* Search Input Container */}
            <div className={`relative transition-all duration-300 min-w-[280px] sm:min-w-[320px] ${
                isFocused ? 'transform md:transform-none scale-105 md:scale-100' : ''
            }`}>
                <div className={`relative bg-gray-900 rounded-2xl md:rounded-full border transition-all duration-300 ${
                    isFocused
                        ? 'border-purple-400 shadow-lg shadow-purple-500/20 md:shadow-none'
                        : 'border-gray-700 hover:border-gray-600'
                }`}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products, shops, and more..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className={`w-full py-3 md:py-2 px-12 md:px-10 bg-transparent text-gray-100 
                               outline-none transition-all duration-300 placeholder-gray-400
                               text-base md:text-sm rounded-2xl md:rounded-full
                               ${isFocused ? 'placeholder-gray-300' : ''}`}
                        aria-label="Search input field"
                    />

                    {/* Search Icon */}
                    <div className={`absolute left-4 md:left-3 top-1/2 transform -translate-y-1/2 
                                   transition-all duration-300 ${
                        isFocused ? 'text-purple-400 scale-110' : 'text-gray-400'
                    }`}>
                        <FiSearch className="text-xl md:text-lg"/>
                    </div>

                    {/* Clear Button */}
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className={`absolute right-4 md:right-3 top-1/2 transform -translate-y-1/2 
                                       text-gray-400 hover:text-gray-200 transition-all duration-300
                                       p-1 rounded-full hover:bg-gray-800 ${
                                isFocused ? 'scale-110' : ''
                            }`}
                            aria-label="Clear search"
                        >
                            <FiX className="text-xl md:text-lg"/>
                        </button>
                    )}
                </div>

                {/* Mobile search indicator */}
                <div className={`md:hidden absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                               w-1/3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 
                               transition-all duration-300 ${
                    isFocused ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}/>
            </div>

            {/* Search Dropdown */}
            {isDropdownOpen && (
                <div className={`absolute w-full mt-3 md:mt-2 
                               bg-gray-900 backdrop-blur-sm bg-opacity-95 md:bg-opacity-100
                               rounded-2xl md:rounded-lg shadow-2xl
                               border border-gray-800 md:border-gray-700
                               overflow-hidden z-50 
                               max-h-[75vh] md:max-h-[70vh] overflow-y-auto
                               animate-in slide-in-from-top-2 duration-300`}>

                    {!searchResults ? (
                        <div className="p-4 md:p-3">
                            {/* Popular Products Section */}
                            <div className="mb-6 md:mb-4">
                                <div className="flex items-center mb-3 md:mb-2 px-2">
                                    <FiTrendingUp className="text-purple-400 mr-2 text-lg md:text-base"/>
                                    <h3 className="text-gray-200 text-base md:text-sm font-semibold">Popular Products</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2">
                                    {popularProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            onClick={() => {
                                                navigate(`/products/${product.id}`);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`flex items-center p-3 md:p-2 
                                                       ${selectedIndex === index ? 'bg-purple-900/40' : 'hover:bg-gray-800/80'}
                                                       rounded-xl md:rounded-lg transition-all duration-200 cursor-pointer
                                                       active:scale-95 hover:shadow-lg hover:shadow-purple-500/10`}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={product.imageUrl || "/Default.png"}
                                                    alt={product.name}
                                                    className="w-14 h-14 md:w-12 md:h-12 object-cover rounded-xl md:rounded-md
                                                             ring-2 ring-gray-700 hover:ring-purple-500/50 transition-all duration-200"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/Default.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-4 md:ml-3 flex-1 min-w-0">
                                                <h4 className="text-gray-200 font-medium text-base md:text-sm truncate mb-1">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center">
                                                    <AiFillStar className="text-yellow-400 text-sm md:text-xs"/>
                                                    <span className="text-gray-400 text-sm md:text-xs ml-1">
                                                        {product.rating}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Shops Section */}
                            <div>
                                <div className="flex items-center mb-3 md:mb-2 px-2">
                                    <FiShoppingBag className="text-emerald-400 mr-2 text-lg md:text-base"/>
                                    <h3 className="text-gray-200 text-base md:text-sm font-semibold">Top Rated Shops</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2">
                                    {topShops.map((shop, index) => (
                                        <div
                                            onClick={() => {
                                                navigate(`/shops/${shop.name}`);
                                                setIsDropdownOpen(false);
                                            }}
                                            key={shop.id}
                                            className={`flex items-center p-3 md:p-2 
                                                       ${selectedIndex === index + popularProducts.length ? 'bg-purple-900/40' : 'hover:bg-gray-800/80'}
                                                       rounded-xl md:rounded-lg transition-all duration-200 cursor-pointer
                                                       active:scale-95 hover:shadow-lg hover:shadow-emerald-500/10`}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={shop.imageUrl || "/PublicShopPage.png"}
                                                    alt={shop.name}
                                                    className="w-12 h-12 md:w-10 md:h-10 object-cover rounded-full
                                                             ring-2 ring-gray-700 hover:ring-emerald-500/50 transition-all duration-200"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/Default.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-4 md:ml-3 flex-1 min-w-0">
                                                <h4 className="text-gray-200 font-medium text-base md:text-sm truncate mb-1">
                                                    {shop.name}
                                                </h4>
                                                <div className="flex items-center">
                                                    <AiFillStar className="text-yellow-400 text-sm md:text-xs"/>
                                                    <span className="text-gray-400 text-sm md:text-xs ml-1">
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
                        <div className="p-4 md:p-3">
                            {searchResults.products.length === 0 && searchResults.shops.length === 0 ? (
                                <div className="text-center py-8 md:py-6">
                                    <div className="text-gray-500 text-6xl md:text-4xl mb-4">🔍</div>
                                    <div className="text-gray-400 text-base md:text-sm mb-2">
                                        No results found for "{searchTerm}"
                                    </div>
                                    <div className="text-gray-500 text-sm md:text-xs">
                                        Try different keywords or check spelling
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 md:space-y-4">
                                    {/* Products Results */}
                                    {searchResults.products.length > 0 && (
                                        <div>
                                            <div className="flex items-center mb-3 md:mb-2 px-2">
                                                <FiTrendingUp className="text-purple-400 mr-2 text-lg md:text-base"/>
                                                <h3 className="text-gray-200 text-base md:text-sm font-semibold">
                                                    Products ({searchResults.products.length})
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2">
                                                {searchResults.products.map((product, index) => (
                                                    <div
                                                        onClick={() => {
                                                            navigate(`/products/${product.id}`);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        key={product.id}
                                                        className={`flex items-center p-3 md:p-2 
                                                                   ${selectedIndex === index ? 'bg-purple-900/40' : 'hover:bg-gray-800/80'}
                                                                   rounded-xl md:rounded-lg transition-all duration-200 cursor-pointer
                                                                   active:scale-95 hover:shadow-lg hover:shadow-purple-500/10`}
                                                    >
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            className="w-14 h-14 md:w-12 md:h-12 object-cover rounded-xl md:rounded-md
                                                                     ring-2 ring-gray-700 hover:ring-purple-500/50 transition-all duration-200"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "/Default.png";
                                                            }}
                                                        />
                                                        <div className="ml-4 md:ml-3 flex-1 min-w-0">
                                                            <h4 className="text-gray-200 font-medium text-base md:text-sm truncate mb-1">
                                                                {product.name}
                                                            </h4>
                                                            <div className="flex items-center">
                                                                <AiFillStar className="text-yellow-400 text-sm md:text-xs"/>
                                                                <span className="text-gray-400 text-sm md:text-xs ml-1">
                                                                    {product.rating}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Shops Results */}
                                    {searchResults.shops.length > 0 && (
                                        <div>
                                            <div className="flex items-center mb-3 md:mb-2 px-2">
                                                <FiShoppingBag className="text-emerald-400 mr-2 text-lg md:text-base"/>
                                                <h3 className="text-gray-200 text-base md:text-sm font-semibold">
                                                    Shops ({searchResults.shops.length})
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2">
                                                {searchResults.shops.map((shop, index) => (
                                                    <div
                                                        onClick={() => {
                                                            navigate(`/shops/${shop.name}`);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        key={shop.id}
                                                        className={`flex items-center p-3 md:p-2 
                                                                   ${selectedIndex === index + searchResults.products.length ? 'bg-purple-900/40' : 'hover:bg-gray-800/80'}
                                                                   rounded-xl md:rounded-lg transition-all duration-200 cursor-pointer
                                                                   active:scale-95 hover:shadow-lg hover:shadow-emerald-500/10`}
                                                    >
                                                        <img
                                                            src={shop.imageUrl}
                                                            alt={shop.name}
                                                            className="w-12 h-12 md:w-10 md:h-10 object-cover rounded-full
                                                                     ring-2 ring-gray-700 hover:ring-emerald-500/50 transition-all duration-200"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "/Default.png";
                                                            }}
                                                        />
                                                        <div className="ml-4 md:ml-3 flex-1 min-w-0">
                                                            <h4 className="text-gray-200 font-medium text-base md:text-sm truncate mb-1">
                                                                {shop.name}
                                                            </h4>
                                                            <div className="flex items-center">
                                                                <AiFillStar className="text-yellow-400 text-sm md:text-xs"/>
                                                                <span className="text-gray-400 text-sm md:text-xs ml-1">
                                                                    {shop.rating}
                                                                </span>
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
    );
};