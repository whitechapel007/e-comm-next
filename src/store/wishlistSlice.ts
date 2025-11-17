import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// store/slices/wishlistSlice.ts
interface WishlistState {
  items: string[]; // Product IDs
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] } as WishlistState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload))
        state.items.push(action.payload);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((id) => id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
