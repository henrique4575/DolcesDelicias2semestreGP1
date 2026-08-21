import type { CatalogItem } from "./commerce-types";

export type CatalogRow = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  category_name: string;
  price: number;
  available: number;
  badge: string | null;
  promotion_id: number | null;
  promotion_title: string | null;
  promotion_description: string | null;
  promotional_price: number | null;
};

export function resolveEffectivePrice(price: number, promotionalPrice: number | null): number {
  return promotionalPrice !== null && promotionalPrice >= 0 && promotionalPrice < price
    ? promotionalPrice
    : price;
}

export function mapCatalogRow(row: CatalogRow): CatalogItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    categoryName: row.category_name,
    price: row.price,
    effectivePrice: resolveEffectivePrice(row.price, row.promotional_price),
    available: Boolean(row.available),
    badge: row.badge,
    promotion: row.promotion_id === null ? null : {
      id: row.promotion_id,
      title: row.promotion_title ?? "Oferta especial",
      description: row.promotion_description ?? "",
    },
  };
}
