import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../../../entities";
import {initialState} from "./liked.types.ts";
import {getLiked, toggleLiked} from "./liked.thunks.ts";
import {RootState} from "../../../app/store.ts";


const likedSlice = createSlice({
    name: 'liked',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<Product>) {
            state.items.push(action.payload);
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearBasket(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLiked.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLiked.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getLiked.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch basket';
            })

            .addCase(toggleLiked.pending, (state, action) => {
                const id = action.meta.arg.id;

                const existing = state.items.find((p) => p.id === id);
                if (existing) {
                    state.items = state.items.filter((p) => p.id !== id);
                } else {
                    state.items.push({ id, favorite: true } as Product);
                }
            })

            // если ошибка — можно откатить
            .addCase(toggleLiked.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to toggle favorite';
            });
    },
});

export const likedSelector = (state: RootState) => state.liked;
export const {addItem, removeItem, clearBasket} = likedSlice.actions;
export default likedSlice.reducer;