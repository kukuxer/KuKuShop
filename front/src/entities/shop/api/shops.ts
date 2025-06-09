import axios from "axios";

export const getShopById = async (shopId: string) => {
    const res = await axios.get(`http://localhost:8080/api/shop/getById/${shopId}`);
    return res.data;
};

export const getShopByName = async (shopName: string) => {
    const res = await axios.get(`http://localhost:8080/api/shop/getByName/${shopName}`);
    return res.data;
};


export const createShop = async (token: string, formData: FormData) => {
    return await axios.post(
        "http://localhost:8080/api/shop/create",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
    );
}

export const doesTheUserOwnAShop = async (token: string) => {
    return await axios.get(
        "http://localhost:8080/api/shop/doesTheUserOwnAShop",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const updateShop = async (token: string, formData: FormData) => {
    return await axios.put(
        "http://localhost:8080/api/shop/private/update",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
    );
}

export const getMyShop = async (token: string) => {
    return await axios.get(
        "http://localhost:8080/api/shop/myShop",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const fetchTopShops = async (limit: number = 12) => {
    const response = await axios.get(`http://localhost:8080/api/shop/public/top/${limit}`);
    return response.data;
};



