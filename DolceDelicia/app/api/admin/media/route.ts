import { getD1, getR2 } from "@/db";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { createMediaKey, validateImageUpload } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return Response.json({ error: "Acesso não autorizado." }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Selecione uma imagem." }, { status: 400 });
    const validationError = validateImageUpload(file);
    if (validationError) return Response.json({ error: validationError }, { status: 400 });
    const key = createMediaKey(file.name);
    await getR2().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" }, customMetadata: { originalName: file.name, uploadedBy: admin.email } });
    await getD1().prepare("INSERT INTO media (object_key,filename,content_type,size_bytes,uploaded_by) VALUES (?,?,?,?,?)").bind(key, file.name, file.type, file.size, admin.email).run();
    return Response.json({ ok: true, key, url: `/api/media/${key}` });
  } catch (error) {
    console.error("media_upload_failed", error);
    return Response.json({ error: "Não foi possível enviar a imagem." }, { status: 500 });
  }
}
