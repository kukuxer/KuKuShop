import {useEffect, useState} from "react";
import { FiShoppingBag } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ErrorPage } from "../../../shared/ui/error-page";
import { ProductBasketCard } from "./ProductBasketCard.tsx";
import { Loading } from "../../../shared/ui/loading";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../app/store.ts";
import {changeProductQuantity, getBasket, removeBasketProduct} from "../../../features/redux/basket";



export const BasketPage = () => {

    const { getAccessTokenSilently } = useAuth0();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { items: basketItems, loading } = useSelector(
        (state: RootState) => state.basket
    );

    useEffect(() => {
        const fetchBasket = async () => {
            try {
                const token = await getAccessTokenSilently();
                await dispatch(getBasket(token)).unwrap();
            } catch (error) {
                console.error("Error fetching basket products:", error);
            }
        };
        fetchBasket();
    }, [dispatch, getAccessTokenSilently]);

    const deleteProduct = async (id: string) => {
        try {
            const token = await getAccessTokenSilently();
            await dispatch(removeBasketProduct({ id, token })).unwrap();
        } catch (err) {
            console.error("Error deleting product:", err);
            setError("Failed to delete product");
        }
    };

    const updateQuantity = async (id: string, change: number) => {
        const currentQuantity = basketItems.find(item => item.id === id)?.quantity ?? 0;
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        try {
            const token = await getAccessTokenSilently();
            await dispatch(changeProductQuantity({ id, quantity: newQuantity, token }));

        } catch (err) {
            console.error("Error updating quantity:", err);
            setError("Failed to update quantity");
        }
    };

    if (loading) return <Loading />;
    if (error) return <ErrorPage errorCode={error} />;

    const subtotal = Array.isArray(basketItems)
        ? basketItems.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0
        )
        : 0;

    const shipping = 9.99;
    const total = subtotal + shipping;

    const basketItemsArray = Array.isArray(basketItems) ? basketItems : [];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-purple-300 mb-8 text-center">
                    Your Basket
                </h1>
                {( !basketItems || basketItems.length === 0) ? (
                    <div className="text-center py-12">
                        <FiShoppingBag className="mx-auto h-16 w-16 text-purple-400" />
                        <h2 className="mt-4 text-xl font-semibold text-purple-300">
                            Your basket is empty
                        </h2>
                        <p className="mt-2 text-gray-400">
                            Start adding some items to your basket
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {basketItemsArray?.map((item) => (
                                <ProductBasketCard
                                    key={item.id}
                                    product={item}
                                    updateQuantity={updateQuantity}
                                    removeItem={deleteProduct}
                                />
                            ))}
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 h-fit sticky top-4 border border-purple-900">
                            <h2 className="text-xl font-semibold text-purple-300 mb-4">
                                Order Summary
                            </h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-700">
                                    <div className="flex justify-between text-xl font-bold text-purple-300">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={basketItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={() => navigate("/myshop")}
                                    className="w-full mt-4 border border-purple-600 text-purple-300 py-3 rounded-lg font-semibold hover:bg-purple-900 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
