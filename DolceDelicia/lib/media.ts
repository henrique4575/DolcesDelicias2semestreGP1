const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function validateImageUpload(file: { type: string; size: number }): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return "Envie uma imagem JPG, PNG, WebP ou AVIF.";
  if (file.size <= 0) return "O arquivo está vazio.";
  if (file.size > MAX_UPLOAD_BYTES) return "A imagem deve ter no máximo 5 MB.";
  return null;
}

export function createMediaKey(filename: string, id = crypto.randomUUID()): string {
  const extension = filename.toLowerCase().match(/\.(jpe?g|png|webp|avif)$/)?.[1] ?? "jpg";
  return `uploads/${id}.${extension === "jpeg" ? "jpg" : extension}`;
}
