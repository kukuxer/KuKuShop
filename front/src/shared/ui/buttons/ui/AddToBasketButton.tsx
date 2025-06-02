import React, {useState} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import ProductEditionPage from "../../../../pages/product/ui/EditProduct.tsx";
import {useNavigate} from "react-router-dom";
import {Product} from "../../../../entities";

interface AddToBasketButtonProps {
    product: Product;
    isRedirectingToEdit?: boolean;
    isEditing?: boolean;
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({
                                                                 product,
                                                                 isRedirectingToEdit = false,
                                                                 isEditing = false,
                                                                 setIsEditing
                                                             }) => {
    const {getAccessTokenSilently} = useAuth0();
    const [loading, setLoading] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    const handleClick = async () => {
        setClicked(true);

        if (!product) {
            console.warn("Product is undefined");
            return;
        }

        if (product.inBasket) return;

        try {
            const token = await getAccessTokenSilently();
            await axios.post(
                `http://localhost:8080/api/public/basket/add/${product.id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleEditProduct = () => {
        if (isRedirectingToEdit) {
            navigate(`/products/${product.id}?isEditing=true`);
        } else {
            setEditing(true);
        }
    };

    if (editing || isEditing) {
        return (
            <ProductEditionPage
                product={product}
                onClose={() => {
                    setEditing(false);
                    if (setIsEditing) setIsEditing(false);
                }}
            />
        );
    }

    return (
        <div className="space-y-3">
            {product?.owner ? (
                <button
                    onClick={handleEditProduct}
                    className="w-full font-semibold py-2 px-4 rounded-lg border-2 border-purple-700 text-purple-400 bg-black hover:bg-purple-700 hover:text-white transition-colors duration-300 shadow-md hover:shadow-purple-700/50"
                >
                    Edit Product
                </button>
            ) : (
                <button
                    onClick={handleClick}
                    disabled={loading || product?.inBasket}
                    className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ${
                        product?.inBasket || clicked
                            ? "bg-transparent text-purple-500 border-1 border-purple-500 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                >
                    {product?.inBasket || clicked
                        ? "This product is in your cart"
                        : "Add to Cart"}
                </button>
            )}
        </div>
    );

};
