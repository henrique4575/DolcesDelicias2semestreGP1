import { getR2 } from "@/db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key: parts } = await context.params;
  const key = parts.join("/");
  if (!key.startsWith("uploads/")) return new Response("Not found", { status: 404 });
  try {
    const object = await getR2().get(key);
    if (!object) return new Response("Not found", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", object.httpMetadata?.cacheControl ?? "public, max-age=31536000, immutable");
    headers.set("x-content-type-options", "nosniff");
    return new Response(object.body, { headers });
  } catch (error) {
    console.error("media_read_failed", error);
    return new Response("Media unavailable", { status: 500 });
  }
}
