import axios from "axios";


export const fetchBasketProducts = async (token: string) => {
    return await axios.get(
        "http://localhost:8080/api/public/basket/products",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const deleteProductFromBasket = async (id: string, token: string) => {
    return await axios.delete(`http://localhost:8080/api/public/basket/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateBasketProductQuantity = async (
    id: string,
    quantity: number,
    token: string
) => {
    const response = await axios.put(
        `http://localhost:8080/api/public/basket/update-quantity/${id}?quantity=${quantity}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};