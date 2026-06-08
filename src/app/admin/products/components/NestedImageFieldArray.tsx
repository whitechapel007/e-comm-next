"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, X, Camera, Check, RotateCcw } from "lucide-react";
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
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraPreview, setCameraPreview] = useState<{
    file: File;
    objectUrl: string;
  } | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `colorVariants.${index}.images`,
  });

  const watchedImages =
    useWatch({
      control,
      name: `colorVariants.${index}.images`,
    }) || [];

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data: UploadResponse = await res.json();
      append({ url: data.url });
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCameraPreview({ file, objectUrl: URL.createObjectURL(file) });
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleUseCameraPhoto = async () => {
    if (!cameraPreview) return;
    URL.revokeObjectURL(cameraPreview.objectUrl);
    await uploadFile(cameraPreview.file);
    setCameraPreview(null);
  };

  const handleRetakePhoto = () => {
    if (cameraPreview) URL.revokeObjectURL(cameraPreview.objectUrl);
    setCameraPreview(null);
    setTimeout(() => cameraInputRef.current?.click(), 50);
  };

  const handleDiscardPhoto = () => {
    if (cameraPreview) URL.revokeObjectURL(cameraPreview.objectUrl);
    setCameraPreview(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    for (const file of files) {
      await uploadFile(file);
    }
  };

  return (
    <FormItem>
      <FormLabel>Images</FormLabel>
      <FormControl>
        <div className="flex flex-col gap-3">
          {/* Camera preview */}
          {cameraPreview && (
            <div className="relative rounded-xl overflow-hidden border-2 border-primary bg-black">
              <img
                src={cameraPreview.objectUrl}
                alt="Camera preview"
                className="w-full max-h-60 object-contain"
              />
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-3 p-3 bg-linear-to-t from-black/70 to-transparent">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDiscardPhoto}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <X size={15} className="mr-1.5" />
                  Discard
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetakePhoto}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <RotateCcw size={15} className="mr-1.5" />
                  Retake
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUseCameraPhoto}
                  disabled={uploading}
                  className="bg-primary text-primary-foreground"
                >
                  <Check size={15} className="mr-1.5" />
                  Use photo
                </Button>
              </div>
            </div>
          )}

          {/* Upload zone */}
          {!cameraPreview && (
            <div
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
                uploading && "pointer-events-none opacity-60",
              )}
              onClick={() => galleryInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Upload size={18} className="text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {uploading ? "Uploading…" : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PNG, JPG, WEBP
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Take a photo"
              >
                <Camera size={13} />
                <span className="hidden sm:inline">Camera</span>
              </button>
            </div>
          )}

          {/* Hidden inputs */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraChange}
            className="hidden"
          />

          {/* Image grid */}
          {watchedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-xl border p-2 sm:grid-cols-4">
              {watchedImages.map((image, idx) => (
                <div
                  key={fields[idx]?.id ?? idx}
                  className="relative rounded-lg border overflow-hidden group aspect-square"
                >
                  <Image
                    src={image.url}
                    alt={`Variant image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, 25vw"
                  />
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition hover:bg-destructive"
                  >
                    <X size={13} />
                  </button>
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
