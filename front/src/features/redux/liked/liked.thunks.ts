import {createAsyncThunk} from "@reduxjs/toolkit";
import {Product} from "../../../entities";

import {fetchFavoriteProducts, toggleFavoriteProduct} from "../../../entities/product/api/FavProducts.ts";

export const getLiked = createAsyncThunk<Product[], string>(
    'liked/getLiked',
    async (token) => {
        return await fetchFavoriteProducts(token);
    }
);

export const toggleLiked = createAsyncThunk<
    { id: string },
    { id: string; token: string }
>(
    'liked/toggleLiked',
    async ({id, token}) => {
        await toggleFavoriteProduct(id, token);
        return {id};
    }
);
