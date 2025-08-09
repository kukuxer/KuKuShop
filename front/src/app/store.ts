import { configureStore } from '@reduxjs/toolkit';
import {basketReducer} from "../features/redux/basket";
import {profileReducer} from "../features/redux/profile";




export const store = configureStore({
    reducer: {
        profile: profileReducer,
        basket: basketReducer
    },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
