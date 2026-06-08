"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import NestedImageFieldArray from "./NestedImageFieldArray";
import NestedStockFieldArray from "./NestedStockFieldArray";
import { toast } from "sonner";
import Link from "next/link";

export interface ColorVariant {
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
  prevPrice?: number | null;
  images?: { url: string }[];
  discount?: number | null;
  category: "KAFTAN" | "AGBADA" | "SHIRTS" | "TWO_PIECE" | "CASUALWEAR";
  isNewArrival: boolean;
  isTopSelling: boolean;
  colorVariants: ColorVariant[];
  sizes: { id?: string; name: string; quantity: string }[];
}

interface ProductFormProps {
  readonly mode: "create" | "edit";
  readonly productId?: string;
  readonly initialValues?: ProductFormValues;
  readonly cancelHref?: string;
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  basePrice: 0,
  prevPrice: undefined,
  discount: undefined,
  category: "KAFTAN",
  isNewArrival: false,
  isTopSelling: false,
  images: [],
  colorVariants: [],
  sizes: [],
};

const uploadImageToAPI = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.url;
};

export default function ProductForm({
  mode,
  productId,
  initialValues,
  cancelHref = "/admin/products",
}: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const methods = useForm<ProductFormValues>({
    defaultValues: initialValues ?? defaultValues,
    mode: "onTouched",
  });

  const { control, register, handleSubmit, formState } = methods;
  const { errors } = formState;

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "colorVariants",
  });

  const submitLabel = mode === "create" ? "Create product" : "Save changes";
  const actionUrl =
    mode === "create"
      ? "/api/admin/products"
      : `/api/admin/products/${productId}`;
  const httpMethod = mode === "create" ? "POST" : "PUT";

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      if (mode === "edit" && !productId) {
        throw new Error("Missing product ID");
      }

      const payload = {
        ...data,
        prevPrice:
          data.prevPrice === undefined || data.prevPrice === null
            ? null
            : Number(data.prevPrice),
        discount:
          data.discount === undefined || data.discount === null
            ? null
            : Number(data.discount),
        images: data.images?.map((image) => ({ url: image.url })) ?? [],
        colorVariants:
          data.colorVariants?.map((variant) => ({
            ...variant,
            price: Number(variant.price),
            images: variant.images?.map((image) => ({ url: image.url })) ?? [],
          })) ?? [],
        sizes: data.sizes.map((size) => ({
          id: size.id,
          name: size.name,
          quantity: size.quantity,
        })),
      };

      const res = await fetch(actionUrl, {
        method: httpMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        const message = json?.error || "Something went wrong";
        throw new Error(message);
      }

      toast.success(
        mode === "create"
          ? "Product created successfully"
          : "Product updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/products");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save product",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">
                  {mode === "create" ? "New product" : "Edit product"}
                </h2>
                <p className="text-sm text-gray-500">
                  Build a product listing with category, price, images, and
                  variants.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...register("name", {
                        required: "Product name is required",
                        minLength: { value: 2, message: "Enter a valid name" },
                      })}
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...register("category", {
                        required: "Select a category",
                      })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="KAFTAN">Kaftans</option>
                      <option value="AGBADA">Agbada</option>
                      <option value="SHIRTS">Shirts</option>
                      <option value="TWO_PIECE">2-Piece</option>
                      <option value="CASUALWEAR">Casualwear</option>
                    </select>
                  </FormControl>
                  <FormMessage>{errors.category?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("basePrice", {
                        required: "Base price is required",
                        valueAsNumber: true,
                        min: {
                          value: 0.01,
                          message: "Price must be at least 0.01",
                        },
                      })}
                    />
                  </FormControl>
                  <FormMessage>{errors.basePrice?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Previous Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("prevPrice", { valueAsNumber: true })}
                    />
                  </FormControl>
                  <FormMessage>{errors.prevPrice?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      {...register("discount", {
                        valueAsNumber: true,
                        min: { value: 0, message: "Must be 0 or above" },
                        max: { value: 100, message: "Must be 100 or less" },
                      })}
                    />
                  </FormControl>
                  <FormMessage>{errors.discount?.message}</FormMessage>
                </FormItem>

                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Write a longer description",
                        },
                      })}
                      rows={4}
                      className="min-h-30 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              </div>
            </div>

            <div className="space-y-4">
              <FormLabel>Gallery</FormLabel>
              <ImageUploadField
                name="images"
                label="Product images"
                uploadFn={uploadImageToAPI}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="isTopSelling"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <FormLabel className="mb-0">Top selling</FormLabel>
              </div>
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="isNewArrival"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <FormLabel className="mb-0">New arrival</FormLabel>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                Variant and stock details
              </h3>
              <p className="text-sm text-gray-500">
                Add color-specific variants with images and stock sizes so
                customers can choose exactly what they want.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Color variants</p>
                  <p className="text-sm text-gray-500">
                    Each variant can have its own price and image set.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendVariant({
                      colorName: "",
                      colorCode: "#000000",
                      price: 0,
                      inStock: true,
                      images: [],
                    })
                  }
                >
                  <Plus className="h-4 w-4" /> Add variant
                </Button>
              </div>

              {variantFields.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No variants yet. Add one to let customers choose different
                  colors.
                </div>
              )}

              <div className="space-y-4">
                {variantFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-3xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">
                        Variant {index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <FormItem>
                        <FormLabel>Color name</FormLabel>
                        <FormControl>
                          <Input
                            {...register(`colorVariants.${index}.colorName`, {
                              required: "Color name is required",
                            })}
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.colorVariants?.[index]?.colorName?.message}
                        </FormMessage>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Color code</FormLabel>
                        <FormControl>
                          <Input
                            type="color"
                            {...register(`colorVariants.${index}.colorCode`)}
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.colorVariants?.[index]?.colorCode?.message}
                        </FormMessage>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`colorVariants.${index}.price`, {
                              required: "Variant price is required",
                              valueAsNumber: true,
                              min: { value: 0, message: "Enter a valid price" },
                            })}
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.colorVariants?.[index]?.price?.message}
                        </FormMessage>
                      </FormItem>

                      <div className="flex items-center gap-3">
                        <Controller
                          control={control}
                          name={`colorVariants.${index}.inStock`}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <FormLabel className="mb-0">In stock</FormLabel>
                      </div>
                    </div>

                    <div className="mt-4">
                      <NestedImageFieldArray control={control} index={index} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <NestedStockFieldArray control={control} />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <Button variant="outline" asChild>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
