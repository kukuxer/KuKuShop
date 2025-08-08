import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {BasketSliceState} from "../../shared/utils/interfaces.ts";
import {Product} from "../../entities";


const initialState: BasketSliceState = {
    items: Product[],
}

const filterSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addProduct(state, action) {
            const findItem = state.items.find(obj => obj.id === action.payload.id);
            if (findItem) {
                findItem.count++
            } else {
                state.items.push({
                    ...action.payload,
                    count: 1
                });
            }
            const total = state.totalPrice = state.items.reduce((sum, obj) => {
                return obj.price * obj.count + sum;
            }, 0);
            state.totalPrice = Math.round(total * 100) / 100;
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        minusItem(state, action: PayloadAction<{ id: string }>) {
            const findItem = state.items.find(obj => obj.id === action.payload.id);
            if (findItem && findItem.count > 1) {
                findItem.count--;
            } else if (findItem) {
                state.items = state.items.filter(obj => obj.id !== action.payload.id);
            }


            state.totalPrice = Math.round(
                state.items.reduce((sum, obj) => obj.price * obj.count + sum, 0) * 100
            ) / 100;
            localStorage.setItem('cart', JSON.stringify(state.items));
        },

        removeItem(state, action: PayloadAction<{ id: string }>) {
            state.items = state.items.filter(obj => obj.id !== action.payload.id);

            state.totalPrice = Math.round(
                state.items.reduce((sum, obj) => obj.price * obj.count + sum, 0) * 100
            ) / 100;
            localStorage.setItem('cart', JSON.stringify(state.items));
        },

        clearItems(state) {
            state.items = [];
            state.totalPrice = 0;
            localStorage.setItem('cart', JSON.stringify(state.items));
        }
    }
})

// export const selectFilter = (state: RootState) => state.filter
// export const selectSort = (state: RootState) => state.filter.sort

export const {setCategoryId,setSearchValue,setCurrentPage,setSort, setFilters} = filterSlice.actions
export default filterSlice.reducer