import { getD1 } from "@/db";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function unauthorized() { return Response.json({ error: "Acesso administrativo não autorizado." }, { status: 401 }); }
function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function number(value: unknown) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : NaN; }
function booleanInt(value: unknown) { return value === false || value === 0 ? 0 : 1; }
function slug(value: unknown) { return text(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export async function GET() {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorized();
  try {
    const database = getD1();
    const [categories, products, locations, menuItems, promotions, media] = await database.batch([
      database.prepare("SELECT * FROM categories ORDER BY sort_order, name"),
      database.prepare("SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id ORDER BY p.name"),
      database.prepare("SELECT * FROM locations ORDER BY sort_order, name"),
      database.prepare("SELECT mi.*, p.name AS product_name, l.name AS location_name FROM menu_items mi JOIN products p ON p.id = mi.product_id JOIN locations l ON l.id = mi.location_id ORDER BY l.sort_order, p.name"),
      database.prepare("SELECT pr.*, p.name AS product_name, l.name AS location_name FROM promotions pr LEFT JOIN products p ON p.id = pr.product_id LEFT JOIN locations l ON l.id = pr.location_id ORDER BY pr.ends_at DESC"),
      database.prepare("SELECT * FROM media ORDER BY created_at DESC LIMIT 100"),
    ]);
    return Response.json({ admin: { name: admin.name, email: admin.email, role: admin.role }, categories: categories.results, products: products.results, locations: locations.results, menuItems: menuItems.results, promotions: promotions.results, media: media.results });
  } catch (error) {
    console.error("admin_catalog_read_failed", error);
    return Response.json({ error: "Não foi possível carregar o painel." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorized();
  let body: { resource?: string; action?: string; data?: Record<string, unknown> };
  try { body = await request.json(); } catch { return Response.json({ error: "Dados inválidos." }, { status: 400 }); }
  const data = body.data ?? {};
  const id = number(data.id);
  const database = getD1();
  try {
    if (body.action === "toggle") {
      const table = ({ category: "categories", product: "products", location: "locations", menuItem: "menu_items", promotion: "promotions" } as const)[body.resource as "category"];
      if (!table || !Number.isInteger(id)) return Response.json({ error: "Registro inválido." }, { status: 400 });
      await database.prepare(`UPDATE ${table} SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(booleanInt(data.active), id).run();
    } else if (body.action === "delete" && (body.resource === "menuItem" || body.resource === "promotion")) {
      const table = body.resource === "menuItem" ? "menu_items" : "promotions";
      await database.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    } else if (body.action === "save" && body.resource === "category") {
      const values = [slug(data.slug || data.name), text(data.name), text(data.description), booleanInt(data.active), number(data.sortOrder) || 0];
      if (!values[0] || !values[1]) throw new Error("VALIDATION");
      if (Number.isInteger(id)) await database.prepare("UPDATE categories SET slug=?, name=?, description=?, active=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(...values, id).run();
      else await database.prepare("INSERT INTO categories (slug,name,description,active,sort_order) VALUES (?,?,?,?,?)").bind(...values).run();
    } else if (body.action === "save" && body.resource === "product") {
      const values = [slug(data.slug || data.name), text(data.name), text(data.description), text(data.imageUrl), number(data.categoryId), booleanInt(data.active)];
      if (!values[0] || !values[1] || !values[2] || !values[3] || !Number.isInteger(values[4])) throw new Error("VALIDATION");
      if (Number.isInteger(id)) await database.prepare("UPDATE products SET slug=?,name=?,description=?,image_url=?,category_id=?,active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(...values, id).run();
      else await database.prepare("INSERT INTO products (slug,name,description,image_url,category_id,active) VALUES (?,?,?,?,?,?)").bind(...values).run();
    } else if (body.action === "save" && body.resource === "location") {
      const values = [slug(data.slug || data.name), text(data.name), text(data.subtitle), text(data.address), text(data.contact), text(data.whatsapp).replace(/\D/g, ""), text(data.hours), text(data.imageUrl), text(data.mapsUrl), booleanInt(data.active), number(data.sortOrder) || 0];
      if (values.slice(0, 9).some((value) => !value)) throw new Error("VALIDATION");
      if (Number.isInteger(id)) await database.prepare("UPDATE locations SET slug=?,name=?,subtitle=?,address=?,contact=?,whatsapp=?,hours=?,image_url=?,maps_url=?,active=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(...values, id).run();
      else await database.prepare("INSERT INTO locations (slug,name,subtitle,address,contact,whatsapp,hours,image_url,maps_url,active,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)").bind(...values).run();
    } else if (body.action === "save" && body.resource === "menuItem") {
      const values = [number(data.productId), number(data.locationId), number(data.price), booleanInt(data.available), booleanInt(data.active), text(data.badge) || null];
      if (!Number.isInteger(values[0]) || !Number.isInteger(values[1]) || !(Number(values[2]) >= 0)) throw new Error("VALIDATION");
      if (Number.isInteger(id)) await database.prepare("UPDATE menu_items SET product_id=?,location_id=?,price=?,available=?,active=?,badge=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(...values, id).run();
      else await database.prepare("INSERT INTO menu_items (product_id,location_id,price,available,active,badge) VALUES (?,?,?,?,?,?) ON CONFLICT(product_id,location_id) DO UPDATE SET price=excluded.price,available=excluded.available,active=excluded.active,badge=excluded.badge,updated_at=CURRENT_TIMESTAMP").bind(...values).run();
    } else if (body.action === "save" && body.resource === "promotion") {
      const values = [text(data.title), text(data.description), text(data.imageUrl) || null, number(data.productId), data.locationId ? number(data.locationId) : null, number(data.promotionalPrice), text(data.startsAt), text(data.endsAt), booleanInt(data.active)];
      if (!values[0] || !values[1] || !Number.isInteger(values[3]) || !(Number(values[5]) >= 0) || !values[6] || !values[7]) throw new Error("VALIDATION");
      if (Number.isInteger(id)) await database.prepare("UPDATE promotions SET title=?,description=?,image_url=?,product_id=?,location_id=?,promotional_price=?,starts_at=?,ends_at=?,active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(...values, id).run();
      else await database.prepare("INSERT INTO promotions (title,description,image_url,product_id,location_id,promotional_price,starts_at,ends_at,active) VALUES (?,?,?,?,?,?,?,?,?)").bind(...values).run();
    } else {
      return Response.json({ error: "Operação não suportada." }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("admin_catalog_write_failed", error);
    const message = error instanceof Error && error.message === "VALIDATION" ? "Preencha todos os campos obrigatórios corretamente." : "Não foi possível salvar. Verifique dados duplicados ou vínculos existentes.";
    return Response.json({ error: message }, { status: 400 });
  }
}
