"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import { ProductFormValues } from "./AddProductModal";

interface NestedStockFieldArrayProps {
  control: Control<ProductFormValues>;
}

const NestedStockFieldArray: React.FC<NestedStockFieldArrayProps> = ({
  control,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  return (
    <div className="my-4">
      <p className="font-semibold mb-2">Sizes & Stock</p>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-[1fr_1fr_40px] gap-4 items-center"
          >
            <Input
              placeholder="Size (e.g., M)"
              type="text"
              {...control.register(`sizes.${index}.name`)}
            />
            <Input
              placeholder="Quantity"
              type="number"
              {...control.register(`sizes.${index}.quantity`)}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        className="mt-3"
        onClick={() => append({ name: "", quantity: "" })}
      >
        Add Stock
      </Button>
    </div>
  );
};

export default NestedStockFieldArray;
