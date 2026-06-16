import sharp from "sharp";

// ─── Passport specifications ───────────────────────────────────────────────

export interface PassportSpec {
  country: string;
  widthPx: number;
  heightPx: number;
  dpi: number;
  bgColor: { r: number; g: number; b: number };
}

export const PASSPORT_SPECS: Record<string, PassportSpec> = {
  usa: {
    country: "United States",
    widthPx: 600,
    heightPx: 600,
    dpi: 300,
    bgColor: { r: 255, g: 255, b: 255 },
  },
  uk: {
    country: "United Kingdom",
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: { r: 255, g: 255, b: 255 },
  },
  canada: {
    country: "Canada",
    widthPx: 590,
    heightPx: 826,
    dpi: 300,
    bgColor: { r: 255, g: 255, b: 255 },
  },
  australia: {
    country: "Australia",
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: { r: 255, g: 255, b: 255 },
  },
  india: {
    country: "India",
    widthPx: 354,
    heightPx: 472,
    dpi: 256,
    bgColor: { r: 255, g: 255, b: 255 },
  },
  pakistan: {
    country: "Pakistan",
    widthPx: 413,
    heightPx: 531,
    dpi: 300,
    bgColor: { r: 238, g: 238, b: 238 },
  },
  uae: {
    country: "UAE",
    widthPx: 472,
    heightPx: 709,
    dpi: 300,
    bgColor: { r: 255, g: 255, b: 255 },
  },
};

// ─── Processing functions ──────────────────────────────────────────────────

/** Resize image for passport — centres content, fills bg */
export async function processPassportPhoto(
  inputBuffer: Buffer,
  countryCode: string
): Promise<Buffer> {
  const spec = PASSPORT_SPECS[countryCode.toLowerCase()];
  if (!spec) throw new Error(`Unsupported country code: ${countryCode}`);

  return sharp(inputBuffer)
    .resize(spec.widthPx, spec.heightPx, {
      fit: "contain",
      background: spec.bgColor,
    })
    .flatten({ background: spec.bgColor })
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();
}

/** Apply pure white background, centre-pad the product */
export async function applyWhiteBackground(
  inputBuffer: Buffer,
  targetWidth = 2000,
  targetHeight = 2000,
  paddingPx = 150
): Promise<Buffer> {
  const contentW = targetWidth - paddingPx * 2;
  const contentH = targetHeight - paddingPx * 2;

  // Resize the transparent PNG to fit within the content area
  const resized = await sharp(inputBuffer)
    .resize(contentW, contentH, { fit: "inside", withoutEnlargement: false })
    .toBuffer();

  const meta = await sharp(resized).metadata();
  const w = meta.width ?? contentW;
  const h = meta.height ?? contentH;

  const left = Math.floor((targetWidth - w) / 2);
  const top = Math.floor((targetHeight - h) / 2);

  // Composite onto white canvas
  return sharp({
    create: {
      width: targetWidth,
      height: targetHeight,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: resized, left, top }])
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();
}

/** LinkedIn profile photo: 400×400, face-entropy crop */
export async function optimiseLinkedIn(inputBuffer: Buffer): Promise<Buffer> {
  return sharp(inputBuffer)
    .resize(400, 400, { fit: "cover", position: "entropy" })
    .jpeg({ quality: 90, progressive: true, mozjpeg: true })
    .toBuffer();
}

/** Instagram DP: 320×320 square */
export async function optimiseInstagramDp(inputBuffer: Buffer): Promise<Buffer> {
  return sharp(inputBuffer)
    .resize(320, 320, { fit: "cover", position: "entropy" })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
}

/** Validate uploaded file (type + size) */
export async function validateImageBuffer(
  buffer: Buffer,
  maxBytes = 20 * 1024 * 1024
): Promise<void> {
  if (buffer.length > maxBytes) {
    throw new Error(
      `File size ${(buffer.length / 1024 / 1024).toFixed(1)} MB exceeds ${maxBytes / 1024 / 1024} MB limit`
    );
  }
  const meta = await sharp(buffer).metadata();
  const allowed = ["jpeg", "png", "webp", "heif", "avif", "gif"];
  if (!meta.format || !allowed.includes(meta.format)) {
    throw new Error(`Unsupported image format: ${meta.format}`);
  }
}

/** Get image dimensions without full decode */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number; format: string }> {
  const meta = await sharp(buffer).metadata();
  return {
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    format: meta.format ?? "unknown",
  };
}
