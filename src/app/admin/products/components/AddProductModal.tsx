"use client";

import { useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import NestedImageFieldArray from "./NestedImageFieldArray";
import NestedStockFieldArray from "./NestedStockFieldArray";
import ImageUploadField from "./ImageUploadField";
import axios from "axios";
import { toast } from "sonner";

interface ColorVariant {
  colorName: string;
  colorCode: string;
  price: number;
  inStock: boolean;
  images: { url: string }[];
}

export interface ProductFormValues {
  name: string;
  description: string;
  basePrice: number;
  prevPrice?: number;
  images?: { url: string }[];
  discount?: number;
  category: string;
  isNewArrival: boolean;
  isTopSelling: boolean;
  colorVariants: ColorVariant[];
  sizes: { name: string; quantity: string }[];
}

export default function AddProductModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const methods = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      prevPrice: undefined,
      discount: undefined,
      category: "SHOES",
      isNewArrival: false,
      isTopSelling: false,
      colorVariants: [],
      sizes: [],
      images: [],
    },
  });

  const { control, handleSubmit, register, reset } = methods;

  const {
    fields: colorVariantFields,
    append: addColorVariant,
    remove: removeColorVariant,
  } = useFieldArray({
    control,
    name: "colorVariants",
  });

  const uploadImageToAPI = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      await axios.post("/api/admin/products", data);
      toast.success("✅ Product added successfully");
      reset();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(`Failed to add product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Name</Label>
                <Input {...register("name", { required: true })} />
              </div>
              <div>
                <Label>Base Price</Label>
                <Input
                  type="number"
                  {...register("basePrice", { required: true })}
                />
              </div>
              <div>
                <Label>Previous Price</Label>
                <Input type="number" {...register("prevPrice")} />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input type="number" {...register("discount")} />
              </div>
              <div className="col-span-2">
                <Label>Category</Label>
                <select
                  {...register("category")}
                  className="w-full border rounded-md p-2"
                >
                  <option value="SHOES">Shoes</option>
                  <option value="BAGS">Bags</option>
                  <option value="CLOTHING">Clothing</option>
                  <option value="ACCESSORIES">Accessories</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <ImageUploadField name="images" uploadFn={uploadImageToAPI} />

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea
                {...register("description")}
                className="w-full border rounded-md p-2"
                rows={3}
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4">
              <Controller
                name="isTopSelling"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Top Selling</Label>

              <Controller
                name="isNewArrival"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>New Arrival</Label>
            </div>

            <Separator />

            {/* Color Variants */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-lg font-semibold">Color Variants</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addColorVariant({
                      colorName: "",
                      colorCode: "#000000",
                      price: 0,
                      inStock: true,
                      images: [],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Variant
                </Button>
              </div>

              {colorVariantFields.map((variant, index) => (
                <div key={variant.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="font-medium">Variant {index + 1}</Label>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => removeColorVariant(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Color Name</Label>
                      <Input
                        {...register(`colorVariants.${index}.colorName`)}
                      />
                    </div>
                    <div>
                      <Label>Color Code</Label>
                      <Input
                        type="color"
                        {...register(`colorVariants.${index}.colorCode`)}
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        {...register(`colorVariants.${index}.price`)}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <Controller
                        name={`colorVariants.${index}.inStock`}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label>In Stock</Label>
                    </div>
                  </div>

                  <div className="mt-3">
                    <NestedImageFieldArray control={control} index={index} />
                  </div>
                </div>
              ))}

              {/* Sizes & Stocks */}
              <NestedStockFieldArray control={control} />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Add Product"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
