export type PublicLocation = {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  address: string;
  contact: string;
  whatsapp: string;
  hours: string;
  imageUrl: string;
  mapsUrl: string;
};

export type CatalogItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  categoryName: string;
  price: number;
  effectivePrice: number;
  available: boolean;
  badge: string | null;
  promotion: null | { id: number; title: string; description: string };
};

export type CartLine = Pick<CatalogItem, "id" | "slug" | "name" | "imageUrl" | "effectivePrice"> & {
  quantity: number;
};

export type CartState = {
  version: 1;
  location: Pick<PublicLocation, "slug" | "name" | "whatsapp"> | null;
  items: CartLine[];
};
