import {createAsyncThunk} from "@reduxjs/toolkit";
import {Product, Shop} from "../../../entities";
import { getMyShop } from "../../../entities/shop/api/shops";
import {getMyProducts} from "../../../entities/product/api/products.ts";

export const fetchMyShop = createAsyncThunk<Shop, string>(
    "shop/fetchMyShop",
    async (token) => {
        return await getMyShop(token);
    }
);

export const fetchMyProducts = createAsyncThunk<Product[], string>(
    "myShop/fetchMyProducts",
    async (token) => {
        const response = await getMyProducts(token);
        return Array.isArray(response.data) ? response.data : [];
    }
);