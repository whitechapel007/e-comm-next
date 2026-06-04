import { ProductType, Category } from "../../../../types/product";

const CATEGORY_LABELS: Record<Category, string> = {
  KAFTAN:     "Kaftans",
  AGBADA:     "Agbada",
  SHIRTS:     "Shirts",
  TWO_PIECE:  "2-Piece",
  CASUALWEAR: "Casualwear",
};

interface Props {
  product: ProductType;
}

const ProductDetailsContent = ({ product }: Readonly<Props>) => {
  const specs = [
    { label: "Category", value: CATEGORY_LABELS[product.category] ?? product.category },
    { label: "Base price", value: `₦${product.basePrice.toLocaleString()}` },
    ...(product.discount ? [{ label: "Discount", value: `${product.discount}%` }] : []),
    ...(product.sizes && product.sizes.length > 0
      ? [{ label: "Available sizes", value: product.sizes.map((s) => s.name).join(", ") }]
      : []),
    ...(product.colorVariants && product.colorVariants.length > 0
      ? [{ label: "Colors", value: product.colorVariants.map((c) => c.colorName).join(", ") }]
      : []),
  ];

  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Product Details
      </h3>

      {product.description && (
        <p className="text-sm sm:text-base text-black/70 mb-6 leading-relaxed">
          {product.description}
        </p>
      )}

      <div>
        {specs.map((item) => (
          <div className="grid grid-cols-3" key={item.label}>
            <p className="text-sm py-3 lg:py-4 pr-2 text-neutral-500">{item.label}</p>
            <div className="col-span-2 py-3 lg:py-4 border-b">
              <p className="text-sm text-neutral-800 font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDetailsContent;
