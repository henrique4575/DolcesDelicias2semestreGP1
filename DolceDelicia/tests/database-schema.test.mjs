import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("configura D1 e R2 nativos do Sites", async () => {
  const hosting = JSON.parse(await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"));
  assert.equal(hosting.d1, "DB");
  assert.equal(hosting.r2, "MEDIA");
});

test("modela todas as entidades comerciais persistentes", async () => {
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  for (const table of ["categories", "products", "locations", "menu_items", "promotions", "media", "admins"]) {
    assert.match(schema, new RegExp(`sqliteTable\\(\\s*["']${table}["']`), `tabela ${table} ausente`);
  }
  assert.match(schema, /uniqueIndex\(["']idx_menu_items_product_location["']/);
  assert.match(schema, /index\(["']idx_menu_items_location_active["']/);
  assert.match(schema, /index\(["']idx_promotions_window["']/);
});
