import {useState, useEffect} from "react";
import {FaSearch} from "react-icons/fa";
import {useAuth0} from "@auth0/auth0-react";
import {useParams} from "react-router-dom";
import {ErrorPage} from "../../../../shared/ui/error-page";
import {Product, type Shop} from "../../../../entities";
import {Loading} from "../../../../shared/ui/loading";
import {ProductCard} from "../../../../entities/product/ui/ProductCard.tsx";
import axios from "axios";
import {PublicShopBanner} from "./PublicShopBanner.tsx";

export const PublicShopPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [shop, setShop] = useState<Shop | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();
    const {shopName} = useParams();

    useEffect(() => {
        const fetchShop = async () => {
            setShop(null);
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/shop/getByName/${shopName}`,
                    {}
                );
                if (response.data) {
                    setShop(response.data);
                    console.log("PublicShopPage data:", response.data);
                } else {
                    setError("PublicShopPage not found");
                }
                console.log("PublicShopPage data:", response.data);
            } catch (err) {
                setError("no shop found with this name");
                console.error("Error fetching shop:", err);
            } finally {
                setLoading(false);
            }
        };

        if (shopName) {
            fetchShop();
        }
    }, [shopName]);

    useEffect(() => {
        const fetchShopProducts = async () => {
            try {
                let headers = {};
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    headers = {
                        Authorization: `Bearer ${token}`,
                    };
                }

                const response = await axios.get(
                    `http://localhost:8080/api/product/getShopProducts/${shopName}`,
                    {headers}
                );

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
    }, [getAccessTokenSilently, isAuthenticated, shopName]);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <ErrorPage errorCode={error}/>;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <PublicShopBanner
                shop={shop || undefined}
            />
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
                        <FaSearch className="absolute right-3 top-3 text-gray-400"/>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 bg-gray-900">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white text-center">
                        Featured Products
                    </h2>
                </div>

                {filteredProducts.length === 0 ? (
                    <h2>Nothing here yet</h2>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
