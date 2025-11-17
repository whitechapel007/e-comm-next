import React, { useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  uploadFn: (file: File) => Promise<string>; // must return uploaded image URL
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label = "Images",
  uploadFn,
}) => {
  const { control, setValue, watch } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images: { url: string }[] = watch(name) || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFn(file);
      setValue(name, [...images, { url }], { shouldValidate: true });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (url: string) => {
    setValue(
      name,
      images.filter((img) => img.url !== url),
      { shouldValidate: true }
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border-dashed border-2 py-6 justify-center"
              >
                <Upload size={18} />
                <span>Click to upload image</span>
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 border p-2 rounded-md">
                  {images.map(({ url }) => (
                    <div
                      key={url}
                      className="relative rounded-lg border overflow-hidden group"
                    >
                      <Image
                        src={url}
                        alt="Uploaded"
                        className="w-full h-24 object-cover"
                        width={100}
                        height={100}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(url)}
                        className={cn(
                          "absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition"
                        )}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>

          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
