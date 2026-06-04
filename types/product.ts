export type Category = "SHOES" | "BAGS" | "CLOTHING" | "ACCESSORIES";

export interface ColorVariantImage {
  id: string;
  colorVariantId: string;
  url: string;
}

export interface Size {
  id: string;
  name: string;
  quantity: string;
}

export interface ColorVariant {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string;
  price: number;
  inStock: boolean;
}

export interface ColorVariantWithImages extends ColorVariant {
  images: ColorVariantImage[];
}

export interface ColorVariantWithDetails extends ColorVariant {
  images: ColorVariantImage[];
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  prevPrice: number | null;
  slug: string;
  basePrice: number;
  discount: number | null;
  rating: number;
  category: Category;
  colorVariants: ColorVariantWithImages[];
  images: { id: string; productId: string; url: string }[];
  sizes: Size[];
  isNewArrival?: boolean;
  isTopSelling?: boolean;
}
