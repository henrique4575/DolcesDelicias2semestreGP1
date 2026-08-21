import assert from "node:assert/strict";
import test from "node:test";
import { mapCatalogRow, resolveEffectivePrice } from "../lib/catalog-service.ts";
import { addItem, buildOrderMessage, cartTotal, emptyCart, setItemQuantity } from "../lib/cart.ts";
import { createMediaKey, validateImageUpload } from "../lib/media.ts";

const location = { id: 1, slug: "biopark", name: "Biopark", subtitle: "", address: "", contact: "", whatsapp: "5545998064748", hours: "", imageUrl: "", mapsUrl: "" };
const row = { id: 1, slug: "brownie", name: "Brownie", description: "Chocolate", image_url: "/brownie.jpg", category: "doces", category_name: "Doces", price: 12, available: 1, badge: null, promotion_id: 8, promotion_title: "Oferta", promotion_description: "Hoje", promotional_price: 9.9 };

test("catálogo aplica promoção válida e converte disponibilidade", () => {
  assert.equal(resolveEffectivePrice(12, 9.9), 9.9);
  assert.equal(resolveEffectivePrice(12, 15), 12);
  assert.deepEqual(mapCatalogRow(row), { id: 1, slug: "brownie", name: "Brownie", description: "Chocolate", imageUrl: "/brownie.jpg", category: "doces", categoryName: "Doces", price: 12, effectivePrice: 9.9, available: true, badge: null, promotion: { id: 8, title: "Oferta", description: "Hoje" } });
});

test("carrinho soma quantidades e gera mensagem completa", () => {
  const item = mapCatalogRow(row);
  let cart = addItem(emptyCart(), location, item);
  cart = addItem(cart, location, item);
  assert.equal(cart.items[0].quantity, 2);
  assert.equal(cartTotal(cart), 19.8);
  assert.match(buildOrderMessage("André", cart), /2x Brownie/);
  assert.match(buildOrderMessage("André", cart), /Biopark/);
  assert.equal(setItemQuantity(cart, 1, 0).items.length, 0);
});

test("carrinho impede mistura silenciosa de unidades", () => {
  const cart = addItem(emptyCart(), location, mapCatalogRow(row));
  assert.throws(() => addItem(cart, { ...location, slug: "matriz", name: "Matriz" }, mapCatalogRow(row)), /LOCATION_CONFLICT/);
});

test("upload aceita somente imagens seguras e cria chave estável", () => {
  assert.equal(validateImageUpload({ type: "image/webp", size: 1000 }), null);
  assert.match(validateImageUpload({ type: "application/pdf", size: 1000 }), /imagem/);
  assert.equal(createMediaKey("Foto.JPEG", "abc"), "uploads/abc.jpg");
});
