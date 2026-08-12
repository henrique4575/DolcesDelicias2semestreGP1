import assert from "node:assert/strict";
import test from "node:test";
import { createWhatsAppUrl } from "../lib/whatsapp.ts";

test("cria uma URL direta do WhatsApp com mensagem codificada", () => {
  const url = new URL(createWhatsAppUrl("Olá, quero encomendar 100 salgados."));

  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5545998064748");
  assert.equal(url.searchParams.get("text"), "Olá, quero encomendar 100 salgados.");
});

test("remove espaços externos da mensagem", () => {
  const url = new URL(createWhatsAppUrl("  Quero conhecer o cardápio.  "));
  assert.equal(url.searchParams.get("text"), "Quero conhecer o cardápio.");
});
