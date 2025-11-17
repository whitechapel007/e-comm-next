"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { ProductFormValues } from "./AddProductModal";
import { cn } from "@/lib/utils";

interface UploadResponse {
  url: string;
}

interface NestedImageFieldArrayProps {
  control: Control<ProductFormValues>;
  index: number;
}

const NestedImageFieldArray: React.FC<NestedImageFieldArrayProps> = ({
  control,
  index,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `colorVariants.${index}.images`,
  });

  const watchedImages =
    useWatch({
      control,
      name: `colorVariants.${index}.images`,
    }) || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data: UploadResponse = await res.json();

      append({ url: data.url });
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <FormItem>
      <FormLabel>Images</FormLabel>
      <FormControl>
        <div className="flex flex-col gap-3">
          {/* Upload Button */}
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex items-center justify-center gap-2 border-dashed border-2 py-6",
              uploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Upload size={18} />
            <span>{uploading ? "Uploading..." : "Click to upload image"}</span>
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Preview Images */}
          {watchedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 border p-2 rounded-md">
              {watchedImages.map((image, idx) => (
                <div
                  key={fields[idx].id}
                  className="relative rounded-lg border overflow-hidden group"
                >
                  <Image
                    src={image.url}
                    alt={`Variant image ${idx + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-24 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(idx)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default NestedImageFieldArray;
