import { getD1 } from "@/db";
import type { PublicLocation } from "@/lib/commerce-types";

type LocationRow = {
  id: number; slug: string; name: string; subtitle: string; address: string;
  contact: string; whatsapp: string; hours: string; image_url: string; maps_url: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getD1().prepare(`
      SELECT id, slug, name, subtitle, address, contact, whatsapp, hours, image_url, maps_url
      FROM locations WHERE active = 1 ORDER BY sort_order, name
    `).all<LocationRow>();
    const locations: PublicLocation[] = result.results.map((row: LocationRow) => ({
      id: row.id, slug: row.slug, name: row.name, subtitle: row.subtitle, address: row.address,
      contact: row.contact, whatsapp: row.whatsapp, hours: row.hours, imageUrl: row.image_url, mapsUrl: row.maps_url,
    }));
    return Response.json({ locations });
  } catch (error) {
    console.error("locations_api_failed", error);
    return Response.json({ error: "Não foi possível carregar as unidades." }, { status: 500 });
  }
}
