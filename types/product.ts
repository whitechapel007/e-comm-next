export interface ColorVariantImage {
  id: string;
  colorVariantId: string;
  url: string;
}

export interface size {
  id: string;
  name: string;
  quantity: string;
  // e.g., "XS", "Small", "Medium"
}
// Stock Type (for size/quantity combinations)

// Color Variant Type (minimal - without relations)
export interface ColorVariant {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string; // e.g., "bg-blue-900" or "#000000"
  price: number;
  inStock: boolean;
}

// Color Variant with Images (commonly used in product displays)
export interface ColorVariantWithImages extends ColorVariant {
  images: ColorVariantImage[];
}

// Color Variant with Full Details (includes images and stock information)
export interface ColorVariantWithDetails extends ColorVariant {
  images: ColorVariantImage[];
}

// Updated Product Type to work with the color variants
export interface ProductType {
  id: string;
  name: string;
  description: string;
  prevPrice: number | null;
  slug: string;
  basePrice: number;
  discount: number | null;
  rating: number;
  category: string;
  colorVariants: ColorVariantWithImages[]; // Using the variant with images
  images: { id: string; productId: string; url: string }[];

  // Optional properties
  sizes?: size[];
  isNewArrival?: boolean;
  isTopSelling?: boolean;
}
