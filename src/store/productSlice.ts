import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColorVariantImage } from "../../types/product";

export type Color = {
  name: string;
  code: string;
  price: number;
  images: ColorVariantImage[];
};

interface ProductSelectionState {
  selectedColor: Color | null;
  selectedSize: string | null;
  currentImageIndex: number;
  currentImage: string;
}

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
    resetProductSelection: () => initialState,
  },
});

export const {
  setColorSelection,
  setSizeSelection,
  setCurrentImageIndex,
  setCurrentImage,
  resetProductSelection,
} = productsSlice.actions;

export default productsSlice.reducer;
