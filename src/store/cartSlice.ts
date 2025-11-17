import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  attributes: string[];
  discount: string | null;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

// ✅ Utility: Load from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) return JSON.parse(storedCart);
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
  }
  return { items: [], totalPrice: 0, totalQuantity: 0 };
};

// ✅ Utility: Save to localStorage
const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
};

// ✅ Utility function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return { totalPrice, totalQuantity };
};

const initialState: CartState =
  typeof window !== "undefined"
    ? loadCartFromStorage()
    : { items: [], totalPrice: 0, totalQuantity: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const { productId, name, price, imageUrl, attributes, discount } =
        action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          productId,
          name,
          price,
          imageUrl,
          quantity: 1,
          attributes,
          discount,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;

      saveCartToStorage(state);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;

      saveCartToStorage(state);
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.productId !== action.payload
          );
        }
      }

      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;

      saveCartToStorage(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;

      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;

      saveCartToStorage(state);
    },
  },
});

export const {
  addItem,
  removeItem,
  decreaseQuantity,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
