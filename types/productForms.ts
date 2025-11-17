// src/types/productForm.ts
export interface ColorVariant {
  colorName: string;
  colorCode: string;
  price: number;
  inStock: boolean;
  images: { url: string }[];
}

export interface SizeItem {
  id?: string;
  name: string;
  quantity: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  basePrice: number | string;
  prevPrice?: number | string | null;
  images?: { url: string }[];
  discount?: number | string | null;
  category: "SHOES" | "BAGS" | "CLOTHING" | "ACCESSORIES";
  isNewArrival: boolean;
  isTopSelling: boolean;
  colorVariants: ColorVariant[];
  sizes: SizeItem[];
}
