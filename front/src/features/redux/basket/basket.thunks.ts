import {createAsyncThunk} from "@reduxjs/toolkit";
import {Product} from "../../../entities";
import {
    addProductToBasket,
    deleteProductFromBasket,
    fetchBasketProducts, updateBasketProductQuantity
} from "../../../entities/product/api/BasketProducts.ts";

export const getBasket = createAsyncThunk<Product[], string>(
    'basket/getBasket',
    async (token) => {
        return await fetchBasketProducts(token);
    }
);

export const addBasketProduct = createAsyncThunk<Product[], { id: string; token: string }>(
    'basket/addBasketProduct',
    async ({ id, token }) => {
        return await addProductToBasket(id, token);
    }
);

export const removeBasketProduct = createAsyncThunk<string, { id: string; token: string }>(
    'basket/removeBasketProduct',
    async ({ id, token }) => {
        await deleteProductFromBasket(id, token);
        return id;
    }
);

export const changeProductQuantity = createAsyncThunk<
    Product,
    { id: string; quantity: number; token: string }
>(
    'basket/changeProductQuantity',
    async ({ id, quantity, token }) => {
        return await updateBasketProductQuantity(id, quantity, token);
    }
);