import {useState, useEffect} from "react";
import {FaShoppingCart, FaSearch, FaPlus} from "react-icons/fa";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";
import {Product, Shop} from "../../../../entities";
import {ErrorPage} from "../../../../shared/ui/error-page";
import {Loading} from "../../../../shared/ui/loading";
import {ProductCard} from "../../../../entities/product/ui/ProductCard.tsx";
import {MyShopBanner} from "./MyShopBanner.tsx";
import {getMyProducts} from "../../../../entities/product/api/products.ts";
import {getMyShop} from "../../../../entities/shop/api/shops.ts";

export const MyShopComponent = () => {
    const [error, setError] = useState<string | null>(null);
    const [shop, setShop] = useState<Shop>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const {getAccessTokenSilently} = useAuth0();


    useEffect(() => {
        const fetchShopProducts = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await getMyProducts(token);
                const productsData = Array.isArray(response.data) ? response.data : [];
                const productsWithOwner = productsData.map((product) => ({
                    ...product,
                    owner: true,
                }));
                setProducts(productsWithOwner);
            } catch (err) {
                setError("Error fetching products");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShopProducts();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await getMyShop(token);
                setShop(response);
            } catch (err) {
                setError("Error fetching shop data");
                console.error("Error fetching shop:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchShop();
    }, [getAccessTokenSilently]);


    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const AddMoreCard = () => (
        <Link to="/productForm">
            <div
                className="bg-gray-800 rounded-lg overflow-hidden h-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-300">
                <div className="text-center p-8 ">
                    <FaPlus
                        className="w-12 h-12 text-purple-500 mx-auto mb-4 transition-transform duration-300 hover:scale-125"/>
                    <p className="text-white font-semibold">Add More Items</p>
                </div>
            </div>
        </Link>
    );

    const EmptyState = () => (
        <div className="text-center py-16">
            <FaShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
            <h3 className="text-2xl font-bold text-white mb-4">
                You don't have any items yet
            </h3>
            <Link to={"/productForm"}>
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                    Create New Item
                </button>
            </Link>
        </div>
    );

    if (loading) {
        return <Loading/>;
    }
    if (error) {
        return <ErrorPage errorCode={error}/>;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="relative ">
                <MyShopBanner shop={shop}/>
            </div>
            <nav className="bg-gray-900 p-4 sticky top-0 border-b border-gray-800">
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
                    <EmptyState/>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                        <AddMoreCard/>
                    </div>
                )}
            </main>
        </div>
    );
};
