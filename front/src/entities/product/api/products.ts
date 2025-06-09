// src/api/products.ts
import axios from "axios";


export const getProductById = async (productId: string, token?: string) => {
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    const res = await axios.get(`http://localhost:8080/api/product/getProduct/${productId}`, {headers});
    const data = res.data;

    if (
        data.imageUrl &&
        (!data.additionalPictures || !data.additionalPictures.includes(data.imageUrl))
    ) {
        data.additionalPictures = [data.imageUrl, ...(data.additionalPictures || [])];
    }

    return data;
};

export const editProduct = async (
    productId: string,
    token: string,
    formData: FormData) => {
    try {
        const res = await axios.put(
            `http://localhost:8080/api/product/private/update/${productId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Edit product failed", error);
        throw error;
    }
};

export const getMyProducts = async (token: string) => {
    return await axios.get(
        "http://localhost:8080/api/product/getMyProducts",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const getProductsByShopName = async (token: string, shopName: string) => {
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    const response = await axios.get(
        `http://localhost:8080/api/product/getShopProducts/${shopName}`,
        {headers}
    );
    return Array.isArray(response.data) ? response.data : [];
};

export const fetchTopProducts = async (limit: number = 12) => {
    const response = await axios.get(`http://localhost:8080/api/product/public/top/${limit}`);
    return response.data;
};