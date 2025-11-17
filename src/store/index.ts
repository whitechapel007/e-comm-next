// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

import wishlistReducer from "./wishlistSlice";
import productReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    product: productReducer,
  },
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
