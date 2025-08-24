import React, {useState, useEffect, useMemo} from "react";
import {FaHeart, FaSearch} from "react-icons/fa";
import {useAuth0} from "@auth0/auth0-react";
import {FavProductCard} from "./FavProductCard.tsx";

import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../app/store.ts";
import {getLiked} from "../../../features/redux/liked";
import {likedSelector} from "../../../features/redux/liked/liked.slice.ts";

export const FavProductsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "date">("date");
    const {getAccessTokenSilently} = useAuth0();


    const {items: likedProducts} = useSelector(likedSelector);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        (async () => {
            const token = await getAccessTokenSilently();
            await dispatch(getLiked(token)).unwrap();
        })();
    }, [getAccessTokenSilently, dispatch]);

    const processedProducts = useMemo(() => {
        let products = [...likedProducts];

        if (searchQuery) {
            products = products.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        switch (sortBy) {
            case "price-asc":
                products.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case "price-desc":
                products.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case "date":
                products.sort(
                    (a, b) =>
                        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                );
                break;
        }

        return products;
    }, [likedProducts, searchQuery, sortBy]);

    const handleSort = (type: "price-asc" | "price-desc" | "date") => {
        setSortBy(type);
    };



    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
                        Liked Products
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400"/>
                        </div>
                        {/* sort */}
                        <select
                            value={sortBy}
                            onChange={(e) =>
                                handleSort(e.target.value as "price-asc" | "price-desc" | "date")
                            }
                            className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {processedProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <FaHeart className="text-6xl text-gray-400 mx-auto mb-4"/>
                        <p className="text-xl text-gray-300">
                            No liked products found. Start adding some!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {processedProducts.map((product) => (
                            <FavProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavProductsPage;
