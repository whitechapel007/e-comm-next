import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  cartKey: string; // productId:size:color — unique per variant combination
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string | null;
  color: string | null;
  discount: number | null;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

export function makeCartKey(productId: string, size?: string | null, color?: string | null) {
  return `${productId}:${size ?? ""}:${color ?? ""}`;
}

const loadCartFromStorage = (): CartState => {
  try {
    if (typeof window === "undefined") return { items: [], totalPrice: 0, totalQuantity: 0 };
    const stored = localStorage.getItem("cart");
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { items: [], totalPrice: 0, totalQuantity: 0 };
};

const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch {
    // ignore
  }
};

const calculateTotals = (items: CartItem[]) => ({
  totalPrice: items.reduce((t, i) => t + i.price * i.quantity, 0),
  totalQuantity: items.reduce((t, i) => t + i.quantity, 0),
});

const initialState: CartState =
  typeof window !== "undefined"
    ? loadCartFromStorage()
    : { items: [], totalPrice: 0, totalQuantity: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, "quantity" | "cartKey">>) => {
      const { productId, size, color } = action.payload;
      const key = makeCartKey(productId, size, color);
      const existing = state.items.find((i) => i.cartKey === key);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, cartKey: key, quantity: 1 });
      }

      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;
      saveCartToStorage(state);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.cartKey !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;
      saveCartToStorage(state);
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.cartKey === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.cartKey !== action.payload);
        }
      }
      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;
      saveCartToStorage(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ cartKey: string; quantity: number }>
    ) => {
      const { cartKey, quantity } = action.payload;
      const item = state.items.find((i) => i.cartKey === cartKey);
      if (item && quantity > 0) item.quantity = quantity;
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

export const { addItem, removeItem, decreaseQuantity, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
