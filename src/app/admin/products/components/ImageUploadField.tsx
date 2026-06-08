import React, { useRef, useState, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { X, Upload, Camera, Check, RotateCcw } from "lucide-react";
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
  uploadFn: (file: File) => Promise<string>;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label = "Images",
  uploadFn,
}) => {
  const { control, setValue, watch } = useFormContext();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cameraPreview, setCameraPreview] = useState<{
    file: File;
    objectUrl: string;
  } | null>(null);

  const images: { url: string }[] = watch(name) || [];

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const url = await uploadFn(file);
        setValue(name, [...(watch(name) || []), { url }], {
          shouldValidate: true,
        });
      } catch (err) {
        console.error("Image upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [uploadFn, setValue, name, watch],
  );

  const handleGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
    const objectUrl = URL.createObjectURL(file);
    setCameraPreview({ file, objectUrl });
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

  const handleDelete = (url: string) => {
    setValue(
      name,
      images.filter((img) => img.url !== url),
      { shouldValidate: true },
    );
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
    <Controller
      control={control}
      name={name}
      render={({ fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <div className="flex flex-col gap-3">
              {/* Camera preview overlay */}
              {cameraPreview && (
                <div className="relative rounded-xl overflow-hidden border-2 border-primary bg-black">
                  <img
                    src={cameraPreview.objectUrl}
                    alt="Camera preview"
                    className="w-full max-h-72 object-contain"
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
                    "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Upload size={22} className="text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {uploading ? "Uploading…" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>

                  {/* Camera button — sits inside zone, top-right corner */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className={cn(
                      "absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                      "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors",
                    )}
                    title="Take a photo"
                  >
                    <Camera size={14} />
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
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 rounded-xl border p-2 sm:grid-cols-4">
                  {images.map(({ url }) => (
                    <div
                      key={url}
                      className="relative rounded-lg border overflow-hidden group aspect-square"
                    >
                      <Image
                        src={url}
                        alt="Uploaded"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 25vw"
                      />
                      <button
                        type="button"
                        onClick={() => handleDelete(url)}
                        className={cn(
                          "absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full",
                          "bg-black/60 text-white opacity-0 group-hover:opacity-100 transition hover:bg-destructive",
                        )}
                      >
                        <X size={13} />
                      </button>
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
