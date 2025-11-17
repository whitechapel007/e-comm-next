import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColorVariantImage } from "../../types/product";

export type Color = {
  name: string;
  code: string;
  price: number;
  images: ColorVariantImage[];
};

// Define a type for the slice state
interface ProductSelectionState {
  selectedColor: Color | null;
  selectedSize: string | null;
  currentImageIndex: number;
  currentImage: string;
}
// Define the initial state using that type
const initialState: ProductSelectionState = {
  selectedColor: null,
  selectedSize: null,
  currentImageIndex: 0,
  currentImage: "",
};

export const productsSlice = createSlice({
  name: "productSelection",

  initialState,
  reducers: {
    setColorSelection: (state, action: PayloadAction<Color>) => {
      state.selectedColor = action.payload;
      state.currentImageIndex = 0;

      // Reset gallery on color change
    },
    setSizeSelection: (state, action: PayloadAction<string>) => {
      state.selectedSize = action.payload;
    },
    setCurrentImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
    setCurrentImage: (state, action: PayloadAction<string>) => {
      state.currentImage = action.payload;
    },
  },
});

export const {
  setColorSelection,
  setSizeSelection,
  setCurrentImageIndex,
  setCurrentImage,
} = productsSlice.actions;

export default productsSlice.reducer;
