import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "placeholder",
  api_key: process.env.CLOUDINARY_API_KEY ?? "placeholder",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "placeholder",
  secure: true,
});

export { cloudinary };

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  bytes: number;
  format: string;
  width: number;
  height: number;
}

export async function uploadBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    publicId?: string;
    resourceType?: "image" | "raw" | "auto";
    format?: string;
    transformation?: object[];
    tags?: string[];
  }
): Promise<CloudinaryUploadResult> {
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_API_SECRET to .env.local");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: options.resourceType ?? "image",
        format: options.format,
        transformation: options.transformation,
        tags: options.tags,
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteAsset(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function generateSignedUploadParams(folder: string) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET ?? ""
  );
  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    folder,
  };
}

export function buildDeliveryUrl(
  publicId: string,
  transformations = "f_auto,q_auto"
): string {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}
