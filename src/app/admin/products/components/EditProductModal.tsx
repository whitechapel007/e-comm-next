"use client";

import { useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from "react-hook-form";
import axios from "axios";
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
import {
  ColorVariantWithDetails,
  ProductType,
  size,
} from "../../../../../types/product";
import { ProductFormValues } from "./AddProductModal";
import ImageUploadField from "./ImageUploadField";
import { toast } from "sonner";

export default function EditProductModal({
  product,
  onClose,
}: {
  product: ProductType;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  // Initialize form with product values
  const methods = useForm<ProductFormValues>({
    defaultValues: {
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      prevPrice: product.prevPrice ?? 0,
      discount: product.discount ?? undefined,
      isTopSelling: product.isTopSelling,
      isNewArrival: product.isNewArrival,
      images: product.images?.map((img) => ({ url: img.url })) || [],
      colorVariants: product.colorVariants.map(
        (v: ColorVariantWithDetails) => ({
          colorName: v.colorName,
          colorCode: v.colorCode,
          price: v.price,
          inStock: v.inStock,
          images: v.images?.map((i) => ({ url: i.url })) || [],
        })
      ),
      sizes: (product.sizes || []).map((s: size) => ({
        id: s.id,
        name: s.name,
        quantity: s.quantity,
      })),
    },
  });

  const { control, register, handleSubmit, reset } = methods;

  // Top-level images
  const { append: appendTopImage } = useFieldArray({
    control,
    name: "images",
  });

  // Color variants
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "colorVariants",
  });

  // Nested variant images component
  function VariantImages({ index }: { index: number }) {
    return (
      <ImageUploadField
        name={`colorVariants.${index}.images`}
        label="Variant Images"
        uploadFn={async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          return data.url;
        }}
      />
    );
  }

  // Update product API
  const updateProduct = async (id: string, data: ProductFormValues) => {
    const payload = {
      ...data,
      basePrice: Number(data.basePrice),
      prevPrice: data.prevPrice == null ? null : Number(data.prevPrice),
      discount: data.discount == null ? null : Number(data.discount),
      colorVariants:
        data.colorVariants?.map((v) => ({
          ...v,
          price: Number(v.price),
          images: v.images?.map((i: { url: string }) => ({ url: i.url })) || [],
        })) || [],
      images: data.images?.map((i: { url: string }) => ({ url: i.url })) || [],
    };

    const response = await axios.put(`/api/admin/products/${id}`, payload);

    if (response.data) {
      const returned = response.data;
      reset({
        name: returned.name,
        description: returned.description,
        basePrice: returned.basePrice,
        prevPrice: returned.prevPrice ?? "",
        discount: returned.discount ?? "",
        isTopSelling: returned.isTopSelling,
        isNewArrival: returned.isNewArrival,
        images:
          returned.images?.map((i: { url: string }) => ({ url: i.url })) || [],
        colorVariants:
          returned.colorVariants?.map((v: ColorVariantWithDetails) => ({
            colorName: v.colorName,
            colorCode: v.colorCode,
            price: v.price,
            inStock: v.inStock,
            images:
              v.images?.map((i: { url: string }) => ({ url: i.url })) || [],
          })) || [],
        sizes:
          returned.sizes?.map((s: size) => ({
            id: s.id,
            name: s.name,
            quantity: s.quantity,
          })) || [],
      });
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      await updateProduct(product.id, data);
      onClose();
    } catch (err) {
      toast.error("❌ Error updating product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input {...register("name" as const)} />
              </div>
              <div>
                <Label>Base Price</Label>
                <Input type="number" {...register("basePrice" as const)} />
              </div>
              <div>
                <Label>Previous Price</Label>
                <Input type="number" {...register("prevPrice" as const)} />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input type="number" {...register("discount" as const)} />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                {...register("description" as const)}
                className="w-full border rounded-md p-2"
                rows={3}
              />
            </div>

            <div className="flex gap-6 items-center">
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

            {/* Product Images */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-lg font-semibold">Product Images</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendTopImage({ url: "" })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Image
                </Button>
              </div>
              <ImageUploadField
                name={`images`}
                label="Product Images"
                uploadFn={async (file) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  return data.url;
                }}
              />
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
                    appendVariant({
                      colorName: "",
                      colorCode: "#000000",
                      price: 0,
                      inStock: true,
                      images: [{ url: "" }],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Variant
                </Button>
              </div>

              <div className="space-y-4">
                {variantFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">Variant {index + 1}</Label>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Color Name</Label>
                        <Input
                          {...register(
                            `colorVariants.${index}.colorName` as const
                          )}
                        />
                      </div>
                      <div>
                        <Label>Color Code</Label>
                        <Input
                          type="color"
                          {...register(
                            `colorVariants.${index}.colorCode` as const
                          )}
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input
                          type="number"
                          {...register(`colorVariants.${index}.price` as const)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          {...register(
                            `colorVariants.${index}.inStock` as const
                          )}
                        />
                        <Label>In Stock</Label>
                      </div>
                    </div>

                    <VariantImages index={index} />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
