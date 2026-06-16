export interface RemoveBgOptions {
  imageUrl?: string;
  imageBuffer?: Buffer;
  size?: "preview" | "full" | "auto";
  type?: "auto" | "person" | "product" | "car";
  bgColor?: string;
  format?: "auto" | "png" | "jpg";
}

export interface RemoveBgResult {
  data: Buffer;
  creditsCharged: number;
  foreground: {
    topPx: number;
    leftPx: number;
    widthPx: number;
    heightPx: number;
  };
}

const REMOVE_BG_API = "https://api.remove.bg/v1.0/removebg";

export async function removeBackground(
  opts: RemoveBgOptions
): Promise<RemoveBgResult> {
  if (!opts.imageUrl && !opts.imageBuffer) {
    throw new Error("Provide either imageUrl or imageBuffer");
  }

  const form = new FormData();

  if (opts.imageUrl) {
    form.append("image_url", opts.imageUrl);
  } else {
    // Convert Buffer to Uint8Array first to avoid SharedArrayBuffer type conflict
    const uint8 = new Uint8Array(opts.imageBuffer!);
    const arrayBuffer = uint8.buffer.slice(
      uint8.byteOffset,
      uint8.byteOffset + uint8.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: "image/png" });
    form.append("image_file", blob, "image.png");
  }

  form.append("size", opts.size ?? "auto");
  form.append("type", opts.type ?? "auto");
  if (opts.bgColor) form.append("bg_color", opts.bgColor.replace("#", ""));

  const res = await fetch(REMOVE_BG_API, {
    method: "POST",
    headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY! },
    body: form,
  });

  if (!res.ok) {
    let message = `remove.bg error ${res.status}`;
    try {
      const body = (await res.json()) as { errors?: { title: string }[] };
      message = body.errors?.[0]?.title ?? message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const arrayBuffer = await res.arrayBuffer();

  return {
    data: Buffer.from(arrayBuffer),
    creditsCharged: parseInt(res.headers.get("X-Credits-Charged") ?? "0", 10),
    foreground: {
      topPx: parseInt(res.headers.get("X-Foreground-Top") ?? "0", 10),
      leftPx: parseInt(res.headers.get("X-Foreground-Left") ?? "0", 10),
      widthPx: parseInt(res.headers.get("X-Foreground-Width") ?? "0", 10),
      heightPx: parseInt(res.headers.get("X-Foreground-Height") ?? "0", 10),
    },
  };
}
