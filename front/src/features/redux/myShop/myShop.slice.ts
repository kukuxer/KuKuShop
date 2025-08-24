import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../../entities";
import {RootState} from "../../../app/store.ts";
import { initialState } from "./myShop.types.ts";
import {fetchMyProducts, fetchMyShop} from "./myShop.thunks.ts";


const myShopSlice = createSlice({
    name: 'myShop',
    initialState,
    reducers: {
        addMyShopItem(state, action: PayloadAction<Product>) {
            state.myShopItems.push(action.payload);
        },
        removeMyShopItem(state, action: PayloadAction<string>) {
            state.myShopItems = state.myShopItems.filter(item => item.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // products
            .addCase(fetchMyProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.myShopItems = action.payload;
            })
            .addCase(fetchMyProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load products";
            })

            // myShop
            .addCase(fetchMyShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyShop.fulfilled, (state, action) => {
                state.loading = false;
                state.myShop = action.payload;
            })
            .addCase(fetchMyShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load shop";
            });
    },
});

export const myShopSelector = (state: RootState) => state.myShop;
export const {addMyShopItem, removeMyShopItem} = myShopSlice.actions;
export default myShopSlice.reducer;