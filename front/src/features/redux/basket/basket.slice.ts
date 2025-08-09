import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../../entities";
import  { initialState } from "./basket.types";
import {addBasketProduct, changeProductQuantity, getBasket, removeBasketProduct} from "./basket.thunks.ts";


const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<Product>) {
            state.items.push(action.payload);
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
            const item = state.items.find(i => i.id === action.payload.productId);
            if (item) item.quantity = action.payload.quantity;
        },
        clearBasket(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(getBasket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBasket.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getBasket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch basket';
            })

            .addCase(addBasketProduct.fulfilled, (state, action) => {
                state.items = action.payload;
            })

            .addCase(removeBasketProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })

            .addCase(changeProductQuantity.fulfilled, (state, action) => {
                const updatedProduct = action.payload;
                const index = state.items.findIndex(p => p.id === updatedProduct.id);
                if (index !== -1) {
                    state.items[index].quantity = updatedProduct.quantity;
                }
            });
    },
});

export const { addItem, removeItem, updateQuantity, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;