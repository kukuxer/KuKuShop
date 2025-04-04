import { useState, useEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";
import Product from "../../entity/Product";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../utils/Loading";
import ProductBasketCard from "./components/ProductBasketCard";


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
  
  const deleteProduct = async (id: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8080/api/public/basket/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to delete product");
  
  
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  
      console.log(`Product ${id} deleted successfully`);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  

  const removeItem = (id: string) => {
    deleteProduct(id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum: number, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shipping = 9.99;
  const total = subtotal + shipping; ;
 

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-purple-300 mb-8 text-center ">Your Basket</h1>

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
                <ProductBasketCard product={item} updateQuantity={updateQuantity} removeItem={removeItem} />
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