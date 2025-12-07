import React, {useEffect, useState} from "react";
import {Product} from "../../../entities";
import {categories} from "../../../shared/constants";
import {fetchProducts} from "../../../entities/product/api/products.ts";
import {additionalCategories} from "../../../shared/constants/constants.ts";
import {ProductCardForCatalog} from "../../../entities/product/ui/ProductCardForCatalog.tsx";
import {useAuth0} from "@auth0/auth0-react";


export const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();

    const [nameQuery, setNameQuery] = useState("");
    const [activeCategories, setActiveCategories] = useState<string[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        let isCancelled = false;

        const load = async () => {
            try {
                let token: string | undefined = undefined;

                if (isAuthenticated) {
                    token = await getAccessTokenSilently();
                }

                const data = await fetchProducts(
                    {
                        page,
                        size: 12,
                        name: debouncedQuery.trim() ? debouncedQuery : undefined,
                        categories: activeCategories.length > 0 ? activeCategories : undefined,
                        token
                    },
                );

                if (!isCancelled) {
                    setProducts(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };

        load();

        return () => {
            isCancelled = true;
        };
    }, [page, debouncedQuery, activeCategories, isAuthenticated, getAccessTokenSilently]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(0);
            setDebouncedQuery(nameQuery);
        }, 200);

        return () => clearTimeout(handler);
    }, [nameQuery]);


    const toggleCategory = (c: string) => {
        setPage(0);
        setActiveCategories(prev =>
            prev.includes(c)
                ? prev.filter(x => x !== c)
                : [...prev, c]
        );
    };


    return (
        <div className="min-h-screen bg-black text-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-8">

                <h1 className="text-3xl font-bold text-gray-100 mb-6">
                    Products
                </h1>

                {/* 🔍 Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={nameQuery}
                        onChange={(e) => setNameQuery(e.target.value)}
                        className="w-full bg-[#111] text-gray-200 px-4 py-3 rounded-lg
               border border-[#333] focus:border-purple-500
               focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]
               outline-none transition"
                    />

                </div>

                {/* 🟪 Categories with stickers/images */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
                                ${activeCategories.includes(cat.id)
                                ? "bg-purple-600 border-purple-400 text-white"
                                : "bg-[#111] border-[#333] text-gray-300 hover:border-purple-500"}
                            `}
                        >
                            {/*{cat.icon && (*/}
                            {/*    <img src={cat.icon} className="w-5 h-5 rounded" />*/}
                            {/*)}*/}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* ➕ Additional name-only categories */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {additionalCategories.map(name => (
                        <button
                            key={name}
                            onClick={() => toggleCategory(name)}
                            className={`px-4 py-2 rounded-full border transition
                                ${activeCategories.includes(name)
                                ? "bg-purple-700 border-purple-400 text-white"
                                : "bg-[#111] border-[#333] text-gray-300 hover:border-purple-500"}
                            `}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                {/* 🟣 Product grid */}
                {products.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No products found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(p => (
                            <ProductCardForCatalog key={p.id} product={p}/>
                        ))}
                    </div>
                )}

                {/* 🔽 Pagination */}
                <div className="mt-10 flex justify-center gap-4">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 bg-[#111] border border-[#333] rounded-lg disabled:opacity-30 hover:border-purple-500"
                    >
                        Prev
                    </button>

                    <span className="text-gray-300">
                        Page <span className="text-purple-400">{page + 1}</span> / {totalPages}
                    </span>

                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-[#111] border border-[#333] rounded-lg disabled:opacity-30 hover:border-purple-500"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
