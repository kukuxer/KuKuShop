import { useState, useEffect } from "react";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import Product from "../../entity/Product";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../utils/Loading";
import ProductBasketCard from "./components/ProductBasketCard";
import { it } from "node:test";

const BasketPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("http://localhost:8080/api/public/basket/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await response.json();
        setCartItems(data);
        console.log("Fetched products:", data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [getAccessTokenSilently]); 

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  

  // const removeItem = (id: number) => {
  //   setCartItems(prevItems => prevItems.filter(item => item.id !== id.toString()));
  // };

  const subtotal = cartItems.reduce(
    (sum: number, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shipping = 9.99;
  const total =  5 ;
  // subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-300 mb-8">Your Basket</h1>

        {cartItems.length === 0 ? (
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
              {cartItems.map((item) => (
                <>
                <ProductBasketCard product={item} />
                {/* <div
                  key={item.id}
                  className="bg-gray-800 rounded-lg p-4 transition-all duration-300 hover:bg-gray-750 border border-purple-900 hover:border-purple-600"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-purple-300">
                        {item.name}
                      </h3>
                      <p className="text-gray-400">${item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-full hover:bg-purple-700 transition-colors"
                        >
                          <FiMinus className="text-purple-300" />
                        </button>
                        <span className="text-purple-300">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-full hover:bg-purple-700 transition-colors"
                        >
                          <FiPlus className="text-purple-300" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded-full hover:bg-red-700 transition-colors ml-4"
                        >
                          <FiTrash2 className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div> */}
                </>
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
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
                <button className="w-full mt-4 border border-purple-600 text-purple-300 py-3 rounded-lg font-semibold hover:bg-purple-900 transition-colors">
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

export default BasketPage;