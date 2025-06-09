import axios from "axios";

export const fetchFavoriteProducts = async (token: string) => {
    const response = await axios.get("http://localhost:8080/api/public/favorites/products", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const toggleFavoriteProduct = async (productId: string, token: string) => {
    return await axios.post(
        `http://localhost:8080/api/public/favorites/${productId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
