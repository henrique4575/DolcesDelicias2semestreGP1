import { getD1 } from "@/db";
import { mapCatalogRow, type CatalogRow } from "@/lib/catalog-service";

type LocationRow = {
  id: number; slug: string; name: string; subtitle: string; address: string;
  contact: string; whatsapp: string; hours: string; image_url: string; maps_url: string;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("location")?.trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: "Selecione uma unidade válida." }, { status: 400 });
  }
  try {
    const database = getD1();
    const location = await database.prepare(`
      SELECT id, slug, name, subtitle, address, contact, whatsapp, hours, image_url, maps_url
      FROM locations WHERE slug = ? AND active = 1 LIMIT 1
    `).bind(slug).first<LocationRow>();
    if (!location) return Response.json({ error: "Unidade não encontrada." }, { status: 404 });

    const result = await database.prepare(`
      SELECT mi.id, p.slug, p.name, p.description, p.image_url,
        c.slug AS category, c.name AS category_name, mi.price, mi.available, mi.badge,
        pr.id AS promotion_id, pr.title AS promotion_title, pr.description AS promotion_description,
        pr.promotional_price
      FROM menu_items mi
      JOIN products p ON p.id = mi.product_id AND p.active = 1
      JOIN categories c ON c.id = p.category_id AND c.active = 1
      LEFT JOIN promotions pr ON pr.id = (
        SELECT candidate.id FROM promotions candidate
        WHERE candidate.product_id = p.id
          AND candidate.active = 1
          AND (candidate.location_id IS NULL OR candidate.location_id = mi.location_id)
          AND datetime(candidate.starts_at) <= datetime('now')
          AND datetime(candidate.ends_at) >= datetime('now')
        ORDER BY candidate.location_id IS NOT NULL DESC, candidate.promotional_price ASC
        LIMIT 1
      )
      WHERE mi.location_id = ? AND mi.active = 1
      ORDER BY c.sort_order, p.name
    `).bind(location.id).all<CatalogRow>();

    return Response.json({
      location: { ...location, imageUrl: location.image_url, mapsUrl: location.maps_url, image_url: undefined, maps_url: undefined },
      items: result.results.map(mapCatalogRow),
    });
  } catch (error) {
    console.error("catalog_api_failed", error);
    return Response.json({ error: "Não foi possível carregar o cardápio agora." }, { status: 500 });
  }
}
