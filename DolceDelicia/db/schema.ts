import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
}, (table) => [uniqueIndex("idx_categories_slug").on(table.slug)]);

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
}, (table) => [
  uniqueIndex("idx_products_slug").on(table.slug),
  index("idx_products_category_active").on(table.categoryId, table.active),
]);

export const locations = sqliteTable("locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  address: text("address").notNull(),
  contact: text("contact").notNull(),
  whatsapp: text("whatsapp").notNull(),
  hours: text("hours").notNull(),
  imageUrl: text("image_url").notNull(),
  mapsUrl: text("maps_url").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
}, (table) => [uniqueIndex("idx_locations_slug").on(table.slug)]);

export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  locationId: integer("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  price: real("price").notNull(),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  badge: text("badge"),
  ...timestamps,
}, (table) => [
  uniqueIndex("idx_menu_items_product_location").on(table.productId, table.locationId),
  index("idx_menu_items_location_active").on(table.locationId, table.active, table.available),
]);

export const promotions = sqliteTable("promotions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
  locationId: integer("location_id").references(() => locations.id, { onDelete: "cascade" }),
  promotionalPrice: real("promotional_price").notNull(),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
}, (table) => [index("idx_promotions_window").on(table.active, table.startsAt, table.endsAt, table.locationId)]);

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  objectKey: text("object_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("idx_media_object_key").on(table.objectKey)]);

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id"),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["owner", "manager"] }).notNull().default("manager"),
  locationId: integer("location_id").references(() => locations.id, { onDelete: "set null" }),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
}, (table) => [
  uniqueIndex("idx_admins_email").on(table.email),
  uniqueIndex("idx_admins_user_id").on(table.userId),
]);

export type CategoryRecord = typeof categories.$inferSelect;
export type ProductRecord = typeof products.$inferSelect;
export type LocationRecord = typeof locations.$inferSelect;
export type MenuItemRecord = typeof menuItems.$inferSelect;
export type PromotionRecord = typeof promotions.$inferSelect;
