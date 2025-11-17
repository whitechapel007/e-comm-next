import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type: string;
};

// 🔧 Example: Local upload (for testing)
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary upload (stream)

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", folder: "ecommerce-products" }, // Auto-detect image/video
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResult);
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
