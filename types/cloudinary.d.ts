// types/cloudinary.d.ts  (or anywhere in your types folder)
declare global {
  namespace Cloudinary {
    interface UploadResultInfo {
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
      format?: string;
      resource_type?: string;
      [key: string]: any;
    }

    interface UploadResult {
      event: "success" | "close" | "error" | string;
      info: UploadResultInfo | string | any;
    }
  }
}
