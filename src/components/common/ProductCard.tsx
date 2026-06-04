import Image from "next/image";
import Link from "next/link";
import RenderStars from "../ui/RenderStars";
import { ProductType } from "../../../types/product";

const ProductCard = ({ product, priority = false }: { product: ProductType; priority?: boolean }) => {
  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="w-full max-w-52 sm:max-w-75 shrink-0"
    >
      <div className="bg-neutral-100 w-full aspect-square justify-center mb-4 flex flex-col items-center rounded-2xl hover:scale-105 transition-transform">
        <Image
          src={product.images[0]?.url || "/images/placeholder.png"}
          alt={product.name}
          className="rounded-md w-full h-full"
          width={295}
          height={298}
          priority={priority}
        />
      </div>
      <div className="w-full text-left">
        <div className="font-semibold text-lg mb-1">{product.name}</div>
        <div className="flex items-center text-sm mb-2">
          <RenderStars rating={product.rating} />
          <span className="ml-2 text-gray-500">{product.rating}/5</span>
        </div>
        <div className="flex items-center gap-2 text-xl font-bold mt-1">
          <span>${product.basePrice}</span>
          {product.prevPrice && (
            <span className="text-gray-400 line-through text-base">
              ${product.prevPrice}
            </span>
          )}
          {product.discount && (
            <span className="text-pink-500 bg-pink-100 text-xs px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
