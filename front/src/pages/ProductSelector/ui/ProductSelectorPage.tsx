import {useState, useMemo} from "react";
import {
    FaStar,
    FaSearch,
    FaFilter,
    FaTimes,
    FaGem,
    FaTshirt,
    FaMobileAlt,
    FaAccessibleIcon,
    FaHome,
    FaRunning,
    FaHeart,
    FaShoppingCart
} from "react-icons/fa";


const sortOptions = [
    {value: "price-asc", label: "Price: Low to High"},
    {value: "price-desc", label: "Price: High to Low"},
    {value: "rating-desc", label: "Highest Rated"},
    {value: "name-asc", label: "Name: A-Z"}
];

const categories = [
    {id: "jewelry", name: "Jewelry", icon: FaGem},
    {id: "clothing", name: "Clothing", icon: FaTshirt},
    {id: "electronics", name: "Electronics", icon: FaMobileAlt},
    {id: "accessories", name: "Accessories", icon: FaAccessibleIcon},
    {id: "homeGoods", name: "Home Goods", icon: FaHome},
    {id: "sports & outdoors", name: "sports & outdoors", icon: FaRunning}
];

export const ProductSelectorPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("price-asc");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [likedProducts, setLikedProducts] = useState([]);

    const products = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 299.99,
            rating: 4.5,
            verified: true,
            category: "Electronics",
            description: "High-quality wireless headphones with noise cancellation",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
        },
        {
            id: 2,
            name: "Professional Camera Kit",
            price: 799.99,
            rating: 5,
            verified: true,
            category: "Photography",
            description: "Professional-grade camera with multiple lenses",
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
        },
        {
            id: 3,
            name: "Smart Fitness Watch",
            price: 199.99,
            rating: 4.2,
            verified: false,
            category: "Wearables",
            description: "Advanced fitness tracking with heart rate monitoring",
            image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a"
        }
    ];

    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            const matchesVerification = !isVerifiedOnly || product.verified;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

            return matchesPrice && matchesVerification && matchesSearch && matchesCategory;
        });

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "rating-desc":
                    return b.rating - a.rating;
                case "name-asc":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    }, [minPrice, maxPrice, isVerifiedOnly, searchQuery, selectedCategory, sortBy]);

    const toggleLike = (productId) => {
        setLikedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const StarRating = ({rating}) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div
                        className={`md:w-1/3 bg-[#1A1A1A] p-6 rounded-lg ${isSidebarOpen ? "block" : "hidden md:block"}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="md:hidden text-gray-400 hover:text-white"
                            >
                                <FaTimes className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block mb-2">Search Products</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#2A2A2A] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Search..."
                                    />
                                    <FaSearch className="absolute left-3 top-3 text-gray-400"/>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">Price Range</label>
                                <div className="flex space-x-4">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(Number(e.target.value))}
                                        className="w-1/2 bg-[#2A2A2A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-1/2 bg-[#2A2A2A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isVerifiedOnly}
                                        onChange={(e) => setIsVerifiedOnly(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-purple-600 bg-black border-purple-600"
                                    />
                                    <span>Verified Products Only</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Products</h1>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden bg-[#2A2A2A] p-2 rounded-lg"
                            >
                                <FaFilter className="w-5 h-5"/>
                            </button>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-400">No products found</p>
                                <button
                                    onClick={() => {
                                        setMinPrice(0);
                                        setMaxPrice(1000);
                                        setIsVerifiedOnly(false);
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                        setSortBy("price-asc");
                                    }}
                                    className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-[#1A1A1A] rounded-lg overflow-hidden transform hover:scale-102 transition-transform duration-300 flex flex-col md:flex-row"
                                    >
                                        <div className="relative w-full md:w-1/3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="object-cover w-full h-48 md:h-full hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            {product.verified && (
                                                <div
                                                    className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 w-full md:w-2/3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-semibold">{product.name}</h3>
                                                <button
                                                    onClick={() => toggleLike(product.id)}
                                                    className={`text-2xl ${likedProducts.includes(product.id) ? "text-red-500" : "text-gray-400"}`}
                                                >
                                                    <FaHeart/>
                                                </button>
                                            </div>
                                            <p className="text-gray-400 mt-2">{product.description}</p>
                                            <div className="mt-4">
                                                <StarRating rating={product.rating}/>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-500">
                          ${product.price.toFixed(2)}
                        </span>
                                                <button
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                                                    <FaShoppingCart/> Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

