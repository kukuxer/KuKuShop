import {configureStore} from '@reduxjs/toolkit';
import {basketReducer} from "../features/redux/basket";
import {profileReducer} from "../features/redux/profile";
import {likedReducer} from "../features/redux/liked";
import {myShopReducer} from "../features/redux/myShop";
import {commentReducer} from "../features/redux/comment";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        basket: basketReducer,
        liked: likedReducer,
        myShop: myShopReducer,
        comment: commentReducer
    },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
